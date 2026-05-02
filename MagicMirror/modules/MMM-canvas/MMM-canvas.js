Module.register("MMM-canvas", {
  
	start: function () {
           Log.info("this module started " + this.name);
	},

	getScripts: function() {
        return [
            this.file('scripts/drawing.js')
        ];
    },

    getStyles: function() {
        return ["MMM-canvas.css"];
    },


    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.alignItems = "center";
        wrapper.style.flexDirection = "column";
	wrapper.style.marginTop = "30px";


        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        wrapper.appendChild(canvas);


        var toolsDiv = document.createElement("div");
        toolsDiv.className = "toolsCanva";

        // Color fields
        var colors = [
            { bg: "rgb(0, 0, 0)", label: "black" },
            { bg: "rgb(62, 190, 77)", label: "green" },
            { bg: "rgb(255, 9, 9)", label: "red" },
            { bg: "rgb(9, 79, 255)", label: "blue" }
        ];

        colors.forEach(color => {
            var colorDiv = document.createElement("div");
            colorDiv.onclick = function() { changeColor(this); };
            colorDiv.className = "color-fieldCanva";
            colorDiv.style.backgroundColor = color.bg;
            toolsDiv.appendChild(colorDiv);
        });

        // Color picker
        var colorInput = document.createElement("input");
        colorInput.oninput = function() { draw_color = this.value; };
        colorInput.type = "color";
        colorInput.className = "color-pickCanva";
        toolsDiv.appendChild(colorInput);

        // Brush size
        var brushInput = document.createElement("input");
        brushInput.oninput = function() { draw_width = this.value; };
        brushInput.type = "range";
        brushInput.className = "brush-sizeCanva";
        brushInput.min = "1";
        brushInput.max = "100";
        toolsDiv.appendChild(brushInput);

        // Clear button
        var clearButton = document.createElement("button");
        clearButton.onclick = clearCanvas;
        clearButton.type = "button";
        clearButton.className = "buttonCanva";
        clearButton.textContent = "clear";
        toolsDiv.appendChild(clearButton);

        wrapper.appendChild(toolsDiv);

        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            // Initialize canvas after DOM is ready
            this.initializeCanvas();
        }
    },

    initializeCanvas: function() {
        var canvas = document.getElementById("canvas");
        if (canvas) {
          
            canvas.width = window.innerWidth * 0.97;
            canvas.height = window.innerHeight * 0.80;
            
            // Initialize  drawing
            if (typeof initDrawing === 'function') {
                initDrawing();
            }
        }
    }

});