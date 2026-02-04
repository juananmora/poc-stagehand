import { readdir, readFile } from "fs/promises";
import path from "path";

interface Skill {
  name: string;
  description: string;
  path: string;
}

async function listSkills(): Promise<Skill[]> {
  const skillsDir = path.join(process.cwd(), ".cursor", "skills");
  const skills: Skill[] = [];

  try {
    const entries = await readdir(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = path.join(skillsDir, entry.name, "SKILL.md");
        try {
          const content = await readFile(skillPath, "utf-8");
          
          // Extract name and description from frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const nameMatch = frontmatter.match(/name:\s*(.+)/);
            const descMatch = frontmatter.match(/description:\s*(.+)/);
            
            skills.push({
              name: nameMatch ? nameMatch[1].trim() : entry.name,
              description: descMatch ? descMatch[1].trim() : "No description available",
              path: entry.name,
            });
          }
        } catch (err) {
          // Skip if SKILL.md doesn't exist
          console.warn(`Warning: Could not read skill at ${entry.name}`);
        }
      }
    }
  } catch (err) {
    console.error("Error reading skills directory:", err);
    process.exit(1);
  }

  return skills;
}

async function main() {
  console.log("📚 Lista de Skills Disponibles\n");
  console.log("=".repeat(60));
  
  const skills = await listSkills();

  if (skills.length === 0) {
    console.log("\n⚠️  No se encontraron skills disponibles.");
    return;
  }

  skills.forEach((skill, index) => {
    console.log(`\n${index + 1}. ${skill.name}`);
    console.log(`   📝 ${skill.description}`);
    console.log(`   📂 Ubicación: .cursor/skills/${skill.path}/`);
  });

  console.log("\n" + "=".repeat(60));
  console.log(`\n✅ Total: ${skills.length} skill${skills.length !== 1 ? 's' : ''} disponible${skills.length !== 1 ? 's' : ''}\n`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
