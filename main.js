(function () {
  const setFooter = () => {
    const footerTxt = document.getElementById("footer-txt");
    if (!footerTxt) return;
    const year = new Date().getFullYear();
    footerTxt.innerHTML = `${year} robinbranders.be`;
  };
  const pidSvg = () => {
    console.log("Started");
    const root = document.getElementById("svg-root");

    if (root === null) return;

    function loadSvg(cb) {
      fetch("sample_pid.svg")
        .then((res) => res.text())
        .then((res) => {
          root.innerHTML = res;

          cb();
        })
        .catch((err) => console.error(err));
    }

    function tagObjects(cb) {
      // Get one of the indicators
      const indicators = [...root.querySelectorAll("[data-rb-indicator-id]")];
      const indicatorIds = [];

      function gc(el, inForeign) {
        if (!el) return;
        let setForeign = inForeign;
        children = [...el.children];

        if (el.localName === "foreignObject") setForeign = true;

        // deepest div in foreign object contains the text
        if (inForeign && children.length === 0 && el.localName === "div") {
          el.id = `data-rb-indicator-id-${indicatorIds.length}`;
          indicatorIds.push(el.id);
        }

        children.forEach((child) => {
          return gc(child, setForeign);
        });
      }

      indicators.forEach((indicator) => {
        gc(indicator, false);
      });

      cb(indicatorIds);

      // Change background of all svg elements
      // This could be fixed in the SVG by setting the background color to transparant
      // [...document.querySelectorAll("[fill]")].forEach((el) => {
      //   el.setAttribute("fill", "lightgrey");
      // });
    }

    function animateIndicators(ids) {
      if (!Array.isArray(ids)) return;
      ids.forEach((id) => {
        setInterval(() => {
          const el = document.getElementById(id);
          el.innerHTML = Math.round(Math.random() * 100);
        }, 1000);
      });
    }

    loadSvg(() => {
      tagObjects((ids) => {
        animateIndicators(ids);
      });
    });
  };

  const loadGraph = () => {
    Dygraph.onDOMready(function onDOMready() {
      g = new Dygraph(
        // containing div
        document.getElementById("graphdiv"),

        // CSV or path to a CSV file.
        "Date,Temperature\n" +
          "2008-05-07,75\n" +
          "2008-05-08,70\n" +
          "2008-05-09,80\n"
      );
    });
  };

  setFooter();
  pidSvg();
  loadGraph();
})();
