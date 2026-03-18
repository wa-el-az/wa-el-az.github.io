import os
import shutil

def main():
    # Define how we want to organize the assets
    organization_map = {
        'assets/gd': [
            'ball_91.png', 'cube_274.png', 'cube_93.png', 'jetpack_3.png',
            'robot_35.png', 'ship_48.png', 'spider_49.png', 'swing_17.png',
            'ufo_79.png', 'wave_46.png', 'gd-logo.svg'
        ],
        'assets/os': [
            'win7.png', 'win8.png', 'win10.png', 'win10x.png', 'win11.png'
        ],
        'assets/fonts': [
            'font1 - WaelMA.png'
        ]
    }

    path_replacements = {}

    print("📁 Creating folders and moving files...")
    for new_folder, files in organization_map.items():
        # Create the new folder if it doesn't exist
        os.makedirs(new_folder, exist_ok=True)
        
        for file in files:
            old_path = os.path.join('assets', file)
            new_path = os.path.join(new_folder, file)
            
            # If the file is in the old location, move it
            if os.path.exists(old_path):
                shutil.move(old_path, new_path)
                print(f"  [Moved] {file} -> {new_folder}/")
                
                # Store the exact string replacement we need for the web files
                old_string = f"assets/{file}"
                new_string = f"{new_folder}/{file}"
                path_replacements[old_string] = new_string

    if not path_replacements:
        print("No files needed to be moved. Have you already run this script?")
        return

    print("\n📝 Scanning and updating HTML, CSS, JS, and JSON files...")
    # Extensions to scan for path updates
    file_types_to_update = ('.html', '.css', '.js', '.json')
    updated_files_count = 0

    for root, dirs, files in os.walk('.'):
        # Skip the git folder and node_modules if you ever add them
        if '.git' in root:
            continue
            
        for file in files:
            if file.endswith(file_types_to_update):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    new_content = content
                    # Replace every old asset path with the new one
                    for old_str, new_str in path_replacements.items():
                        new_content = new_content.replace(old_str, new_str)

                    # If the file actually changed, write it back
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"  [Updated] {file_path}")
                        updated_files_count += 1
                except Exception as e:
                    print(f"  [Error] Could not process {file_path}: {e}")

    print(f"\n✅ Done! Moved {len(path_replacements)} files and updated {updated_files_count} web files.")

if __name__ == "__main__":
    main()