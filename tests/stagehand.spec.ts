import "dotenv/config";
import OpenAI from "openai";
import { expect, test } from "@playwright/test";
import { CustomOpenAIClient, Stagehand } from "@browserbasehq/stagehand";

test("navegacion y disponibilidad con Stagehand", async ({}, testInfo) => {
  test.setTimeout(240000);

  const stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      viewport: { width: 1280, height: 720 },
    },
    llmClient: new CustomOpenAIClient({
      modelName: "qwen3-coder:480b-cloud",
      client: new OpenAI({
        apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
        baseURL: process.env.OLLAMA_API_BASE ?? "http://localhost:11434/v1",
      }) as unknown as any,
    }),
  });

  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.setViewportSize(1280, 720);
  const productName = "Camiseta Authentic Hombre Primera Equipación Blanca 25/26";

  const actWithRetry = async (instruction: string, retries = 2) => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await stagehand.act(instruction);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  const attachShot = async (label: string) => {
    await page.setViewportSize(1280, 720);
    const buffer = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${label}.png`, {
      body: buffer,
      contentType: "image/png",
    });
  };

  const expectExtractContains = async (
    instruction: string,
    expected: string,
    label: string,
    failureMessage: string,
    options?: {
      retries?: number;
      retryDelayMs?: number;
      onRetryInstruction?: string;
    }
  ) => {
    const retries = options?.retries ?? 0;
    const retryDelayMs = options?.retryDelayMs ?? 1500;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const extracted = await stagehand.extract(instruction);
      const extractedText =
        typeof extracted === "object" &&
        extracted !== null &&
        "extraction" in extracted
          ? String((extracted as { extraction?: unknown }).extraction ?? "")
          : typeof extracted === "string"
          ? extracted
          : JSON.stringify(extracted);
      if (extractedText.toLowerCase().includes(expected.toLowerCase())) {
        return;
      }
      if (attempt < retries) {
        if (options?.onRetryInstruction) {
          await safeAct(options.onRetryInstruction, `${label}-retry-act`, 1);
        }
        await page.waitForTimeout(retryDelayMs);
        continue;
      }
      await testInfo.attach(`${label}-extract.txt`, {
        body: extractedText,
        contentType: "text/plain",
      });
      await attachShot(`${label}-missing`);
      expect(false, failureMessage).toBe(true);
    }
  };

  const safeAct = async (instruction: string, label: string, retries = 2) => {
    try {
      await actWithRetry(instruction, retries);
      return true;
    } catch (error) {
      await testInfo.attach(`${label}-error.txt`, {
        body: String(error),
        contentType: "text/plain",
      });
      return false;
    }
  };

  const pickActionByText = (actions: any[], needle: string) => {
    const lowered = needle.toLowerCase();
    return actions.find((action) => {
      const desc = String(action?.description ?? "").toLowerCase();
      const text = String(action?.element?.text ?? "").toLowerCase();
      return desc.includes(lowered) || text.includes(lowered);
    });
  };

  const actFromObservation = async (
    instruction: string,
    needle: string,
    label: string
  ) => {
    const actions = (await stagehand.observe(instruction)) as any[];
    const match = pickActionByText(actions, needle);
    if (!match) {
      await testInfo.attach(`${label}-observe.txt`, {
        body: JSON.stringify(actions, null, 2),
        contentType: "application/json",
      });
      return false;
    }
    await stagehand.act(match as any);
    return true;
  };

  await test.step("Abrir listado de jugadores", async () => {
    await page.goto("https://shop.realmadrid.com/content/players");
    await page.waitForLoadState("domcontentloaded");
    await attachShot("01-players-list");
  });

  await test.step("Aceptar cookies si aparece", async () => {
    const accepted = await actFromObservation(
      "Find the cookie consent accept button if it exists. Do not close other dialogs.",
      "accept",
      "cookies"
    );
    if (!accepted) {
      await safeAct("Accept cookies on the site if prompted.", "cookies-act", 1);
    }
    await attachShot("02-accepted-cookies");
  });

  await test.step("Abrir pagina de Dani Carvajal", async () => {
    const opened = await actFromObservation(
      "From the players list page, find the Carvajal player card/link and open it.",
      "carvajal",
      "carvajal-from-list"
    );
    if (!opened) {
      await safeAct(
        "Open the Dani Carvajal player page. Do not add to cart or start checkout.",
        "carvajal-act",
        1
      );
    }
    await page.waitForLoadState("domcontentloaded");
    await expectExtractContains(
      "Confirm the current page is for player Dani Carvajal. Reply with the player name visible on the page.",
      "carvajal",
      "carvajal-player",
      "No se detecto la pagina de Dani Carvajal.",
      {
        retries: 1,
        onRetryInstruction:
          "Scroll a bit if needed and confirm the player name shown is Carvajal.",
      }
    );
    await attachShot("03-dani-carvajal-page");
  });

  await test.step("Abrir producto de la camiseta", async () => {
    const opened = await actFromObservation(
      "From the Carvajal player page, find the product link for the official kit and open it.",
      productName,
      "open-product"
    );
    if (!opened) {
      await safeAct(
        `Open the "${productName}" product page from the current page. Do not add to cart or start checkout.`,
        "open-product-fallback",
        1
      );
    }
    await page.waitForLoadState("domcontentloaded");
    await expectExtractContains(
      `Confirm the current product page title matches exactly: "${productName}". Reply with the product title as shown on the page.`,
      productName,
      "product-page",
      "No se detecto la camiseta especificada en la prueba."
    );
    await expectExtractContains(
      "Confirm the product is associated with Dani Carvajal. Reply with the player name shown or selected in any personalization section.",
      "carvajal",
      "product-carvajal",
      "El producto no parece estar asociado a Carvajal.",
      {
        retries: 2,
        onRetryInstruction:
          "If there is a personalization/customization section, open it and ensure the player name is set to Dani Carvajal, then confirm it is visible.",
      }
    );
    await attachShot("04-product-page");
  });

  await test.step("Seleccionar talla L", async () => {
    await safeAct(
      "Select size L on the product page if available. Do not add to cart or start checkout.",
      "select-size-l"
    );
    await attachShot("05-size-l-selection");
  });

  const availability = await stagehand.extract(
    `From the product page, report the product name, price, and whether size L is available/selected. Do not add to cart or start checkout. The target product name is "${productName}".`
  );

  const summary = await stagehand.extract(
    "Write a 2-4 sentence summary of the product page including the price and any notable details (discounts, badges, shipping notes, or customization options). Do not add to cart or start checkout."
  );

  await testInfo.attach("availability.txt", {
    body: String(availability),
    contentType: "text/plain",
  });

  await testInfo.attach("summary.txt", {
    body: String(summary),
    contentType: "text/plain",
  });

  await stagehand.close();
});
