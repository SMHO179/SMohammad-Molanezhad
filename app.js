document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");
    const commands = {
        help: "whoami, skills, projects, contact, clear",
        whoami: "SMHO179 | Backend Developer | Go · Python · Linux · DevOps",

        skills: "Go, Python, Docker, Kubernetes, Linux",

        contact: `
    Email: SMHO11@protonmail.com
    GitHub: https://github.com/SMHO179
    `,

        projects: `
    camera-lock
    GoWeather
    metadata-viewer
    fastfetch-config
    `,

        clear: "__CLEAR__"
    };
    ;

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

        function type() {
            if (i < text.length) {
                div.textContent += text[i++];
                setTimeout(type, speed);
            } else if (cb) cb();
        }

        type();
    }

    function runHelp() {
        print("Available commands:");
        print(commands.help);
        createInput();
    }

    function createInput() {
        const line = document.createElement("div");
        line.className = "input-line";

        line.innerHTML = `
            <span class="prompt">~/portfolio $</span>
            <input autocomplete="off" spellcheck="false" />
        `;

        terminal.appendChild(line);

        const input = line.querySelector("input");
        input.focus();

        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;

            const value = input.value.trim().toLowerCase();

            line.innerHTML = `
                <span class="prompt">~/portfolio $</span>
                <span class="command">${value}</span>
            `;

            if (value === "help") {
                runHelp();
            }
            else if (value === "clear") {
                terminal.innerHTML = "";
                boot();
            }
            else if (commands[value]) {
                print(commands[value]);
                createInput();
            }
            else {
                print("command not found: " + value);
                createInput();
            }
        });
    }

    function boot() {
        printType("booting SMHO179 terminal...", 15, () => {
            print("system ready.");
            print("type 'help' to begin.");

            setTimeout(runHelp, 400);
        });
    }

    boot();
});
