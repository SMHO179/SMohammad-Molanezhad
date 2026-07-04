document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");

    // Portfolio Content updated with actual repositories
    const commands = {
        whoami: "SMHO179 | Backend Developer | Go · Python · Linux · DevOps",
        skills: `<br>
                 > <b>Languages:</b> Go, Python, Bash, SQL<br>
                 > <b>Tools:</b> Docker, Kubernetes, Linux, Git, CI/CD<br>
                 > <b>Cloud:</b> AWS, GCP`,
        projects: `<br>
                   📦 <b><a href="https://github.com/SMHO179/camera-lock-github" target="_blank">camera-lock</a></b><br>
                   &nbsp;&nbsp;&nbsp;Python + OpenCV script that locks your Linux screen when no face is detected.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/GoWeather" target="_blank">GoWeather</a></b><br>
                   &nbsp;&nbsp;&nbsp;Weather application utility built entirely in Go.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/searxng-docker-compose" target="_blank">searxng-docker-compose</a></b><br>
                   &nbsp;&nbsp;&nbsp;Docker Compose setup to self-host a private, decentralized SearXNG metasearch instance.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/fastfetch-config" target="_blank">fastfetch-config</a></b><br>
                   &nbsp;&nbsp;&nbsp;Custom configuration layouts for the fastfetch system information terminal tool.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/iris-on-knn" target="_blank">iris-on-knn</a></b><br>
                   &nbsp;&nbsp;&nbsp;Machine learning classification implementation using the K-Nearest Neighbors algorithm.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/metadata-viwer" target="_blank">metadata-viwer</a></b><br>
                   &nbsp;&nbsp;&nbsp;File metadata extraction and viewing utility tool.<br><br>

                   📦 <b><a href="https://github.com/SMHO179/Py-calculator" target="_blank">Py-calculator</a></b><br>
                   &nbsp;&nbsp;&nbsp;A clean, core calculation application written in Python.`,
        contact: `<br>
                  Email: <a href="mailto:hello@example.com">hello@example.com</a><br>
                  GitHub: <a href="https://github.com/SMHO179" target="_blank">github.com/SMHO179</a>`,
        help: "Available commands: <span class='cmd-highlight'>whoami</span>, <span class='cmd-highlight'>skills</span>, <span class='cmd-highlight'>projects</span>, <span class='cmd-highlight'>contact</span>, <span class='cmd-highlight'>clear</span>"
    };

    function createInput() {
        const line = document.createElement("div");
        line.className = "line interactive-line";

        line.innerHTML = `
            <span class="prompt">SMHO179@portfolio:~$</span>
            <input type="text" class="cmd-input" autocomplete="off" spellcheck="false" autofocus>
        `;

        terminal.appendChild(line);

        const inputField = line.querySelector(".cmd-input");

        // Small delay ensures the focus works perfectly after DOM updates
        setTimeout(() => inputField.focus(), 10);

        inputField.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                const commandText = this.value.trim().toLowerCase();

                // Freeze the input into static text
                this.parentElement.innerHTML = `
                    <span class="prompt">SMHO179@portfolio:~$</span>
                    <span class="command">${commandText}</span>
                `;

                handleCommand(commandText);
            }
        });
    }

    function handleCommand(cmd) {
        if (cmd === "clear") {
            terminal.innerHTML = "";
            createInput();
            return;
        }

        if (cmd !== "") {
            const output = document.createElement("div");
            output.className = "output";

            if (commands[cmd]) {
                output.innerHTML = commands[cmd];
            } else {
                output.innerHTML = `Command not found: <span style="color: var(--pink)">${cmd}</span>. Type 'help' to see available commands.`;
            }
            terminal.appendChild(output);
        }

        createInput();

        // Smoothly scroll down
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }

    // Always keep focus on the terminal when the user clicks the background
    document.body.addEventListener("click", () => {
        const activeInput = document.querySelector(".cmd-input");
        if (activeInput) {
            activeInput.focus();
        }
    });

    createInput();
});
