document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");

    const commands = {
        help: () => {
            print("Available commands:");
            print("help, whoami, skills, projects, contact, clear");
        },

        whoami: () => print("SMHO179 | Backend Developer | Go · Python · Linux · DevOps"),

        skills: () => print("Go, Python, Docker, Kubernetes, Linux"),

        contact: () => print(
`Email: SMHO11@protonmail.com
GitHub: https://github.com/SMHO179`
        ),

        projects: () => print(
`camera-lock
GoWeather
metadata-viewer
fastfetch-config`
        ),

        clear: () => {
            terminal.innerHTML = "";
            boot();
            return false;
        }
    };

    function print(text) {
        const div = document.createElement("div");
        div.className = "output";
        div.style.whiteSpace = "pre";
        div.textContent = text;
        terminal.appendChild(div);
    }

    function printType(text, speed = 15, cb) {
        const div = document.createElement("div");
        div.className = "output";
        terminal.appendChild(div);

        let i = 0;

        (function type() {
            if (i < text.length) {
                div.textContent += text[i++];
                setTimeout(type, speed);
            } else if (cb) cb();
        })();
    }

    function runCommand(cmd) {
        const value = cmd.trim().toLowerCase();

        print(`~/portfolio $ ${value}`);

        if (commands[value]) {
            const result = commands[value]();
            if (result === false) return;
        } else {
            print(`command not found: ${value}`);
        }

        createInput();
    }

    function createInput() {
        const line = document.createElement("div");
        line.className = "input-line";

        const input = document.createElement("input");
        input.autocomplete = "off";
        input.spellcheck = false;

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "~/portfolio $";

        line.appendChild(prompt);
        line.appendChild(input);

        terminal.appendChild(line);

        input.focus();

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const value = input.value;

                // freeze input
                input.disabled = true;

                line.innerHTML = `
                    <span class="prompt">~/portfolio $</span>
                    <span class="command"></span>
                `;

                line.querySelector(".command").textContent = value;

                runCommand(value);
            }
        });
    }

    function boot() {
        printType("booting SMHO179 terminal...", 15, () => {
            print("system ready.");
            print("type 'help' to begin.");
            setTimeout(() => commands.help(), 300);
            createInput();
        });
    }

    boot();
});
