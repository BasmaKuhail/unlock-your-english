export function getStudentInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const studentTones = [
  "bg-[#eaf0ff] text-brand",
  "bg-[#edfbf4] text-[#19734e]",
  "bg-[#fff4e8] text-[#9a5b17]",
  "bg-[#f4edff] text-[#7047a8]",
];

export function getStudentTone(studentId: string): string {
  let hash = 0;

  for (const character of studentId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return studentTones[hash % studentTones.length];
}