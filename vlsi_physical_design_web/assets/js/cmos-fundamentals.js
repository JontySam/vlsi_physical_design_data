(() => {
    const svgNs = "http://www.w3.org/2000/svg";
    const chartSize = { width: 560, height: 340, left: 60, right: 22, top: 20, bottom: 48 };
    const familyVgs = [0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2];
    const familyVds = [0.4, 0.8, 1.2, 1.8, 2.4, 3.0];
    const colors = ["#5c6ac4", "#3f84e5", "#2f7f73", "#4ba36d", "#d9903d", "#d96c4a", "#ba4a63"];

    function createSvgNode(tag, attrs) {
        const node = document.createElementNS(svgNs, tag);
        Object.entries(attrs).forEach(([key, value]) => {
            node.setAttribute(key, String(value));
        });
        return node;
    }

    function formatVoltage(value) {
        return `${value.toFixed(2)} V`;
    }

    function formatCurrent(value) {
        return `${value.toFixed(2)} mA`;
    }

    function formatGm(value) {
        return `${value.toFixed(2)} mS`;
    }

    function ids(vgs, vds, vth, beta, lambda) {
        if (vgs <= vth) {
            return 0;
        }
        const vov = vgs - vth;
        if (vds < vov) {
            return beta * (((vov * vds) - (0.5 * vds * vds)) * (1 + (lambda * vds)));
        }
        return 0.5 * beta * vov * vov * (1 + (lambda * vds));
    }

    function gm(vgs, vds, vth, beta, lambda) {
        if (vgs <= vth) {
            return 0;
        }
        const vov = vgs - vth;
        if (vds < vov) {
            return beta * vds * (1 + (lambda * vds));
        }
        return beta * vov * (1 + (lambda * vds));
    }

    function region(vgs, vds, vth) {
        if (vgs <= vth) {
            return "Cut-off";
        }
        return vds < (vgs - vth) ? "Linear / triode" : "Saturation";
    }

    function samplePoints(generator, xMax, step) {
        const points = [];
        for (let x = 0; x <= xMax + 1e-9; x += step) {
            points.push({ x, y: generator(Number(x.toFixed(4))) });
        }
        return points;
    }

    function buildPath(points, xMax, yMax) {
        const plotWidth = chartSize.width - chartSize.left - chartSize.right;
        const plotHeight = chartSize.height - chartSize.top - chartSize.bottom;
        return points.map((point, index) => {
            const x = chartSize.left + (point.x / xMax) * plotWidth;
            const y = chartSize.height - chartSize.bottom - (point.y / yMax) * plotHeight;
            return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(" ");
    }

    function drawChart(svg, config) {
        svg.innerHTML = "";
        svg.setAttribute("viewBox", `0 0 ${chartSize.width} ${chartSize.height}`);

        const plotWidth = chartSize.width - chartSize.left - chartSize.right;
        const plotHeight = chartSize.height - chartSize.top - chartSize.bottom;
        const xMax = config.xMax;
        const yMax = Math.max(config.yMax, 0.05);
        const xTicks = 6;
        const yTicks = 5;

        svg.appendChild(createSvgNode("rect", {
            x: 0,
            y: 0,
            width: chartSize.width,
            height: chartSize.height,
            fill: "#f6efe6",
            rx: 14,
            ry: 14
        }));

        for (let i = 0; i <= xTicks; i += 1) {
            const value = (xMax / xTicks) * i;
            const x = chartSize.left + (value / xMax) * plotWidth;
            svg.appendChild(createSvgNode("line", {
                x1: x,
                y1: chartSize.top,
                x2: x,
                y2: chartSize.height - chartSize.bottom,
                stroke: "#d9ccb8",
                "stroke-width": 1
            }));
            const label = createSvgNode("text", {
                x,
                y: chartSize.height - 18,
                "text-anchor": "middle",
                "font-size": 12,
                fill: "#5d5348"
            });
            label.textContent = value.toFixed(1);
            svg.appendChild(label);
        }

        for (let i = 0; i <= yTicks; i += 1) {
            const value = (yMax / yTicks) * i;
            const y = chartSize.height - chartSize.bottom - (value / yMax) * plotHeight;
            svg.appendChild(createSvgNode("line", {
                x1: chartSize.left,
                y1: y,
                x2: chartSize.width - chartSize.right,
                y2: y,
                stroke: "#d9ccb8",
                "stroke-width": 1
            }));
            const label = createSvgNode("text", {
                x: chartSize.left - 10,
                y: y + 4,
                "text-anchor": "end",
                "font-size": 12,
                fill: "#5d5348"
            });
            label.textContent = value.toFixed(1);
            svg.appendChild(label);
        }

        svg.appendChild(createSvgNode("line", {
            x1: chartSize.left,
            y1: chartSize.top,
            x2: chartSize.left,
            y2: chartSize.height - chartSize.bottom,
            stroke: "#756552",
            "stroke-width": 1.5
        }));
        svg.appendChild(createSvgNode("line", {
            x1: chartSize.left,
            y1: chartSize.height - chartSize.bottom,
            x2: chartSize.width - chartSize.right,
            y2: chartSize.height - chartSize.bottom,
            stroke: "#756552",
            "stroke-width": 1.5
        }));

        const xLabel = createSvgNode("text", {
            x: chartSize.left + (plotWidth / 2),
            y: chartSize.height - 4,
            "text-anchor": "middle",
            "font-size": 13,
            fill: "#3a342d"
        });
        xLabel.textContent = config.xLabel;
        svg.appendChild(xLabel);

        const yLabel = createSvgNode("text", {
            x: 18,
            y: chartSize.top + (plotHeight / 2),
            "text-anchor": "middle",
            "font-size": 13,
            fill: "#3a342d",
            transform: `rotate(-90 18 ${chartSize.top + (plotHeight / 2)})`
        });
        yLabel.textContent = config.yLabel;
        svg.appendChild(yLabel);

        config.series.forEach((series) => {
            svg.appendChild(createSvgNode("path", {
                d: buildPath(series.points, xMax, yMax),
                fill: "none",
                stroke: series.color,
                "stroke-width": series.width || 3,
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            }));
        });

        (config.markers || []).forEach((marker) => {
            const x = chartSize.left + (marker.x / xMax) * plotWidth;
            const y = chartSize.height - chartSize.bottom - (marker.y / yMax) * plotHeight;
            svg.appendChild(createSvgNode("circle", {
                cx: x,
                cy: y,
                r: 5.5,
                fill: marker.fill || "#ffffff",
                stroke: marker.stroke || "#22363d",
                "stroke-width": 2
            }));
        });
    }

    function seriesMax(series) {
        return Math.max(...series.flatMap((item) => item.points.map((point) => point.y)), 0.2) * 1.12;
    }

    function near(value, target, tolerance) {
        return Math.abs(value - target) <= tolerance;
    }

    function setupOutputChart() {
        const chart = document.getElementById("mosfet-output-chart");
        if (!chart) {
            return;
        }
        const inputs = {
            vth: document.getElementById("out-vth"),
            beta: document.getElementById("out-beta"),
            lambda: document.getElementById("out-lambda"),
            highlightVgs: document.getElementById("out-highlight-vgs"),
            pointVgs: document.getElementById("out-point-vgs"),
            pointVds: document.getElementById("out-point-vds")
        };
        const outputs = {
            vth: document.getElementById("out-vth-value"),
            beta: document.getElementById("out-beta-value"),
            lambda: document.getElementById("out-lambda-value"),
            highlightVgs: document.getElementById("out-highlight-vgs-value"),
            pointVgs: document.getElementById("out-point-vgs-value"),
            pointVds: document.getElementById("out-point-vds-value"),
            region: document.getElementById("out-region"),
            current: document.getElementById("out-id")
        };

        function update() {
            const state = {
                vth: Number(inputs.vth.value),
                beta: Number(inputs.beta.value),
                lambda: Number(inputs.lambda.value),
                highlightVgs: Number(inputs.highlightVgs.value),
                pointVgs: Number(inputs.pointVgs.value),
                pointVds: Number(inputs.pointVds.value)
            };

            outputs.vth.textContent = formatVoltage(state.vth);
            outputs.beta.textContent = `${state.beta.toFixed(2)} mA/V^2`;
            outputs.lambda.textContent = `${state.lambda.toFixed(2)} 1/V`;
            outputs.highlightVgs.textContent = formatVoltage(state.highlightVgs);
            outputs.pointVgs.textContent = formatVoltage(state.pointVgs);
            outputs.pointVds.textContent = formatVoltage(state.pointVds);

            const series = familyVgs.map((vgs, index) => ({
                color: colors[index],
                width: near(vgs, state.highlightVgs, 0.21) ? 4.5 : 2.2,
                points: samplePoints((vds) => ids(vgs, vds, state.vth, state.beta, state.lambda), 3.3, 0.06)
            }));

            const pointCurrent = ids(state.pointVgs, state.pointVds, state.vth, state.beta, state.lambda);
            outputs.region.textContent = region(state.pointVgs, state.pointVds, state.vth);
            outputs.current.textContent = formatCurrent(pointCurrent);

            drawChart(chart, {
                xMax: 3.3,
                yMax: seriesMax(series),
                xLabel: "VDS (V)",
                yLabel: "IDS (mA)",
                series,
                markers: [{ x: state.pointVds, y: pointCurrent, fill: "#fff3e8", stroke: "#22363d" }]
            });
        }

        Object.values(inputs).forEach((input) => input.addEventListener("input", update));
        update();
    }

    function setupTransferChart() {
        const chart = document.getElementById("mosfet-transfer-chart");
        if (!chart) {
            return;
        }
        const inputs = {
            vth: document.getElementById("tr-vth"),
            beta: document.getElementById("tr-beta"),
            lambda: document.getElementById("tr-lambda"),
            highlightVds: document.getElementById("tr-highlight-vds"),
            pointVgs: document.getElementById("tr-point-vgs")
        };
        const outputs = {
            vth: document.getElementById("tr-vth-value"),
            beta: document.getElementById("tr-beta-value"),
            lambda: document.getElementById("tr-lambda-value"),
            highlightVds: document.getElementById("tr-highlight-vds-value"),
            pointVgs: document.getElementById("tr-point-vgs-value"),
            current: document.getElementById("tr-id")
        };

        function update() {
            const state = {
                vth: Number(inputs.vth.value),
                beta: Number(inputs.beta.value),
                lambda: Number(inputs.lambda.value),
                highlightVds: Number(inputs.highlightVds.value),
                pointVgs: Number(inputs.pointVgs.value)
            };

            outputs.vth.textContent = formatVoltage(state.vth);
            outputs.beta.textContent = `${state.beta.toFixed(2)} mA/V^2`;
            outputs.lambda.textContent = `${state.lambda.toFixed(2)} 1/V`;
            outputs.highlightVds.textContent = formatVoltage(state.highlightVds);
            outputs.pointVgs.textContent = formatVoltage(state.pointVgs);

            const series = familyVds.map((vds, index) => ({
                color: colors[index],
                width: near(vds, state.highlightVds, 0.11) ? 4.5 : 2.2,
                points: samplePoints((vgs) => ids(vgs, vds, state.vth, state.beta, state.lambda), 3.3, 0.05)
            }));

            const pointCurrent = ids(state.pointVgs, state.highlightVds, state.vth, state.beta, state.lambda);
            outputs.current.textContent = formatCurrent(pointCurrent);

            drawChart(chart, {
                xMax: 3.3,
                yMax: seriesMax(series),
                xLabel: "VGS (V)",
                yLabel: "IDS (mA)",
                series,
                markers: [{ x: state.pointVgs, y: pointCurrent, fill: "#ecfff8", stroke: "#2f7f73" }]
            });
        }

        Object.values(inputs).forEach((input) => input.addEventListener("input", update));
        update();
    }

    function setupGmChart() {
        const chart = document.getElementById("mosfet-gm-chart");
        if (!chart) {
            return;
        }
        const inputs = {
            vth: document.getElementById("gm-vth"),
            beta: document.getElementById("gm-beta"),
            lambda: document.getElementById("gm-lambda"),
            highlightVds: document.getElementById("gm-highlight-vds"),
            pointVgs: document.getElementById("gm-point-vgs")
        };
        const outputs = {
            vth: document.getElementById("gm-vth-value"),
            beta: document.getElementById("gm-beta-value"),
            lambda: document.getElementById("gm-lambda-value"),
            highlightVds: document.getElementById("gm-highlight-vds-value"),
            pointVgs: document.getElementById("gm-point-vgs-value"),
            gm: document.getElementById("gm-gm")
        };

        function update() {
            const state = {
                vth: Number(inputs.vth.value),
                beta: Number(inputs.beta.value),
                lambda: Number(inputs.lambda.value),
                highlightVds: Number(inputs.highlightVds.value),
                pointVgs: Number(inputs.pointVgs.value)
            };

            outputs.vth.textContent = formatVoltage(state.vth);
            outputs.beta.textContent = `${state.beta.toFixed(2)} mA/V^2`;
            outputs.lambda.textContent = `${state.lambda.toFixed(2)} 1/V`;
            outputs.highlightVds.textContent = formatVoltage(state.highlightVds);
            outputs.pointVgs.textContent = formatVoltage(state.pointVgs);

            const series = familyVds.map((vds, index) => ({
                color: colors[index],
                width: near(vds, state.highlightVds, 0.11) ? 4.5 : 2.2,
                points: samplePoints((vgs) => gm(vgs, vds, state.vth, state.beta, state.lambda), 3.3, 0.05)
            }));

            const pointGm = gm(state.pointVgs, state.highlightVds, state.vth, state.beta, state.lambda);
            outputs.gm.textContent = formatGm(pointGm);

            drawChart(chart, {
                xMax: 3.3,
                yMax: seriesMax(series),
                xLabel: "VGS (V)",
                yLabel: "gm (mS)",
                series,
                markers: [{ x: state.pointVgs, y: pointGm, fill: "#fff0ea", stroke: "#d96c4a" }]
            });
        }

        Object.values(inputs).forEach((input) => input.addEventListener("input", update));
        update();
    }

    function initCmosFundamentalsLab() {
        if (initCmosFundamentalsLab.initialized) {
            return;
        }
        initCmosFundamentalsLab.initialized = true;
        setupOutputChart();
        setupTransferChart();
        setupGmChart();
    }

    window.initCmosFundamentalsLab = initCmosFundamentalsLab;
})();
