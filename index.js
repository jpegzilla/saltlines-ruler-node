// JavaScript function library meant to provide JavaScript quicker and easier access to
// CSS units like VH, VMIN, CH, PC, etc.
// this may not work in Internet Explorer or Safari.
// initially created by jpegzilla, on March 18th, 2019.

const ruler = () => {
  if (typeof window === "undefined") {
    throw new Error("[NOBROWSER] saltlines only works if window is defined.");
  } else {
    let vh, vw, vmin, vmax, ch, pc, em, rem, inch, cm, ppi, diag, aspectRatio;
    vh = window.innerHeight;
    vw = window.innerWidth;
    let ruler = (r = {});

    const py = (a, b) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    const reduce = f => {
      for (var i = f[0]; i > 0; i--) {
        if (0 == f[0] % i && 0 == f[1] % i) {
          var n = f[0] / i;
          var d = f[1] / i;
          return { n, d };
        }
      }
    };

    const saltlines = {
      viewPortUnits: () => {
        if (vh > vw) {
          vmin = ruler.vmin = vw;
          vmax = ruler.vmax = vh;
        } else {
          vmin = ruler.vmin = vh;
          vmax = ruler.vmax = vw;
        }
        let one_vmin = (ruler.one_vmin = vmin / 100);
        let one_vmax = (ruler.one_vmax = vmax / 100);
        let one_vh = (ruler.one_vh = vh / 100);
        let one_vw = (ruler.one_vw = vw / 100);

        ruler.vh = vh;
        ruler.vw = vw;

        return { one_vmin, vmin, one_vh, one_vw, one_vmax, vmax, vh, vw };
      },

      rootFontSize: () => {
        let fz = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("font-size");
        fz = parseFloat(fz);
        fz = fz + "px";

        ruler.rootFontSize = fz;

        return { rootFontSize: fz };
      },

      windowSizes: () => {
        let fullWidth = (ruler.fullWidth = screen.width);
        let fullHeight = (ruler.fullHeight = screen.height);
        let windowWidth = (ruler.windowWidth = window.innerWidth);
        let windowHeight = (ruler.windowHeight = window.innerHeight);
        let windowDiag = py(windowWidth, windowHeight);
        windowDiag = windowDiag.toFixed(2);
        ruler.windowDiag = Number(windowDiag);

        aspectRatio = reduce([fullWidth, fullHeight]);
        ruler.aspectRatio = `${aspectRatio.n}:${aspectRatio.d}`;

        return {
          fullWidth,
          fullHeight,
          windowWidth,
          windowHeight,
          windowDiag,
          aspectRatio
        };
      },

      physicalUnits: () => {
        let newDiv = document.createElement("div");
        newDiv.style.cssText =
          "position: absolute;top: -1in;left: -1in;height: 1in;width: 1in;visibility: hidden;";
        newDiv.setAttribute("id", "inch");

        document.body.appendChild(newDiv);

        let fullWidth = screen.width;
        let fullHeight = screen.height;
        let ppix = (ruler.ppi = document.getElementById("inch").offsetWidth);
        let ppiy = document.getElementById("inch").offsetHeight;
        let inchHeight = fullHeight / ppiy;
        inchHeight = inchHeight.toFixed(2);
        inchHeight = ruler.inchHeight = Number(inchHeight);
        let inchWidth = fullWidth / ppix;
        inchWidth = inchWidth.toFixed(2);
        inchWidth = ruler.inchWidth = Number(inchWidth);
        let pt = ppix / 72;
        pt = pt.toFixed(2);
        ruler.pt = Number(pt);
        let pc = (ruler.pc = pt * 12);
        document.body.removeChild(newDiv);
        return { inchHeight, inchWidth, ppix, pt, pc };
      },

      unitList: () => {
        console.groupCollapsed(
          "%clist of all units (click to expand):",
          "padding: 0 2em; background: inherit; color: inherit; font-size: 18px; font-family: Arial"
        );
        let arr = Object.keys(ruler);
        for (let i = 0; i < arr.length; i++) {
          console.log(
            `%c ${arr[i]}`,
            "margin-left: 24px; background: inherit; color: inherit; font-size: 12px; font-family: Courier"
          );
        }
        console.groupEnd();
      }
    };

    const getAllUnits = () => {
      Object.values(saltlines).map(value => {
        if (typeof value === "function" && value.name !== "unitList") {
          value.call();
        }
      });
    };

    Function.prototype.valueOf = function() {
      this.call(this);
      return 0;
    };

    getAllUnits();

    window.addEventListener("resize", () => getAllUnits());

    return ruler;
  }
};

module.exports = ruler();
