import os
import glob
import re

BLOG_DIR = r"c:\Code\DA_NetworkingPrograming\NetworkingPrograming\content\blogs"

def generate_en_files():
    vi_files = glob.glob(os.path.join(BLOG_DIR, "*.vi.md"))
    
    print(f"Found {len(vi_files)} Vietnamese blog files.")
    
    for vi_path in vi_files:
        en_path = vi_path.replace(".vi.md", ".en.md")
        
        # Read VI content
        with open(vi_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract Frontmatter
        match = re.search(r"^---\s+(.*?)\s+---", content, re.DOTALL)
        if match:
            frontmatter = match.group(1)
            
            # Simple title extraction/modification
            title_match = re.search(r'title: "(.*?)"', frontmatter)
            if title_match:
                vi_title = title_match.group(1)
                en_title = f"{vi_title} (English)"
                # Replace title
                frontmatter = frontmatter.replace(f'title: "{vi_title}"', f'title: "{en_title}"')
            
            # Construct EN content
            en_content = f"---\n{frontmatter}\n---\n\n"
            en_content += "# Content is available in Vietnamese\n\n"
            en_content += "> ⚠️ **English translation is in progress.**\n>\n"
            en_content += "> Please switch to Vietnamese for the full content.\n\n"
            en_content += "We are working hard to translate our technical articles. Please check back later!\n"
            
            # Write EN file
            with open(en_path, "w", encoding="utf-8") as f:
                f.write(en_content)
            
            print(f"Created: {os.path.basename(en_path)}")
        else:
            print(f"Skipping {os.path.basename(vi_path)} (No frontmatter found)")

if __name__ == "__main__":
    generate_en_files()
