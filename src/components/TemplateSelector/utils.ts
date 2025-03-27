
export const generateStructureFromContent = (content: string) => {
  try {
    const lines = content.split('\n');
    const sections = [];
    
    let currentSection = null;
    
    for (const line of lines) {
      const h2Match = line.match(/^## (.+)$/);
      
      if (h2Match) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: h2Match[1].trim(),
          content: ""
        };
      } else if (currentSection) {
        if (currentSection.content) {
          currentSection.content += "\n" + line;
        } else {
          currentSection.content = line;
        }
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return { sections };
  } catch (error) {
    console.error("Error generating structure from content:", error);
    return null;
  }
};
