import { promises as fs } from "fs";
import path from "path";

export interface TravelLessonSourceFile {
  id: string;
  label: string;
  relativePath: string;
  source: string;
}

const TRAVEL_SOURCE_ROOT_CANDIDATES = [
  path.resolve(process.cwd(), "..", "tutorials", "travel"),
  path.resolve(process.cwd(), "tutorials", "travel"),
  path.resolve(process.cwd(), "..", "travel"),
  path.resolve(process.cwd(), "travel"),
  path.resolve(process.cwd(), "..", "第二章：langchain 基础旅行助手"),
  path.resolve(process.cwd(), "第二章：langchain 基础旅行助手"),
  path.resolve(process.cwd(), "..", "第二章Langchain旅行基础助手"),
  path.resolve(process.cwd(), "第二章Langchain旅行基础助手"),
  path.resolve(process.cwd(), "..", "..", "anti", "course", "langchain 基础"),
  path.resolve(process.cwd(), "..", "anti", "course", "langchain 基础"),
];

const LESSON_SOURCE_FILES: Record<string, { dir: string; files: string[] }> = {
  "lesson-1": {
    dir: "lesson01",
    files: ["simple_agent.py", "requirements.txt", "run.sh"],
  },
  "lesson-2": {
    dir: "lesson02",
    files: ["agent_with_tools.py", "requirements.txt", "run.sh", "README.md"],
  },
  "lesson-3": {
    dir: "lesson03",
    files: ["agent_with_memory.py", "requirements.txt", "run.sh", "README.md"],
  },
  "lesson-4": {
    dir: "lesson04",
    files: ["travel_planner.py", "requirements.txt", "run.sh", "README.md"],
  },
  "lesson-5": {
    dir: "lesson05",
    files: [
      "agent.py",
      "app.py",
      "templates/index.html",
      "static/style.css",
      "requirements.txt",
      "run.sh",
      "README.md",
    ],
  },
};

async function resolveTravelSourceRoot() {
  for (const candidate of TRAVEL_SOURCE_ROOT_CANDIDATES) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function getTravelLessonSourceFiles(
  lessonId: string
): Promise<TravelLessonSourceFile[]> {
  const config = LESSON_SOURCE_FILES[lessonId];
  if (!config) return [];
  const sourceRoot = await resolveTravelSourceRoot();
  if (!sourceRoot) return [];

  const lessonRoot = path.join(sourceRoot, config.dir);
  const files = await Promise.all(
    config.files.map(async (relativePath) => {
      const fullPath = path.join(lessonRoot, relativePath);

      try {
        const source = await fs.readFile(fullPath, "utf8");
        return {
          id: relativePath,
          label: path.basename(relativePath),
          relativePath,
          source,
        };
      } catch {
        return null;
      }
    })
  );

  return files.filter((file): file is TravelLessonSourceFile => file !== null);
}
