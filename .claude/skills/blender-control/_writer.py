import os
target = os.path.join("C:", os.sep, "Users", "{DEIN_USER}", "Desktop", "{DEIN_PROJEKT}", "{DEIN_PROJEKT}", ".claude", "skills", "blender-control", "SKILL.md")
L = []
a = L.append
exec(open(os.path.join(os.path.dirname(target), "_content_lines.py"), encoding="utf-8").read())
with open(target, "w", encoding="utf-8") as f:
    f.write(chr(10).join(L) + chr(10))
print(f"Written {len(L)} lines")
