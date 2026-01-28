import "dotenv/config";
import OpenAI from "openai";
import { CustomOpenAIClient, Stagehand } from "@browserbasehq/stagehand";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

async function main() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    llmClient: new CustomOpenAIClient({
      modelName: "gpt-oss:20b-cloud",
      client: new OpenAI({
        apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
        baseURL: process.env.OLLAMA_API_BASE ?? "http://localhost:11434/v1",
      }) as unknown as any,
    }),
  });

  await stagehand.init();

  const page = stagehand.context.pages()[0];

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = path.resolve("reports", `run-${timestamp}`);
  await mkdir(runDir, { recursive: true });

  const capture = async (label: string) => {
    const fileName = `${label}.png`;
    const filePath = path.join(runDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    return `./${fileName}`;
  };

  await page.goto("https://shop.realmadrid.com/content/players");

  await stagehand.act("Accept cookies on the site if prompted.");
  const cookiesShot = await capture("01-accepted-cookies");

  await stagehand.act(
    "Open the Dani Carvajal player page. Do not add to cart or start checkout."
  );
  const playerShot = await capture("02-dani-carvajal-page");

  await stagehand.act(
    "Open the 'Camiseta Authentic Hombre Primera Equipación Blanca 25/26' product page. Do not add to cart or start checkout."
  );
  const productShot = await capture("03-product-page");

  await stagehand.act(
    "Select size L on the product page if available. Do not add to cart or start checkout."
  );
  const sizeShot = await capture("04-size-l-selection");

  const availability = await stagehand.extract(
    "From the product page, report the product name, price, and whether size L is available/selected. Do not add to cart or start checkout."
  );
  console.log(`Product check:\n`, availability);

  const summary = await stagehand.extract(
    "Write a 2-4 sentence summary of the product page including the price and any notable details (discounts, badges, shipping notes, or customization options). Do not add to cart or start checkout."
  );
  console.log(`Summary:\n`, summary);

  const report = `# Reporte de prueba

## Ejecucion
- URL: https://shop.realmadrid.com/content/players
- Fecha: ${new Date().toISOString()}
- Comando: npm start

## Navegacion (con screenshots)
1. Aceptar cookies (si aplica)  
![](${cookiesShot})
2. Pagina de Dani Carvajal  
![](${playerShot})
3. Pagina de producto  
![](${productShot})
4. Seleccion de talla L  
![](${sizeShot})

## Comprobacion del producto
${availability}

## Resumen generado
${summary}
`;

  await writeFile(path.join(runDir, "report.md"), report, "utf-8");

  await stagehand.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
