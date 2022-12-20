const redirectTemplate = `<html>
<head>
    <script>
        function getCookie(e) {
            var t = document.cookie,
                n = e + "=",
                o = t.indexOf("; " + n);
            if (-1 == o) {
                if (0 != (o = t.indexOf(n))) return null;
            } else {
                o += 2;
                var i = document.cookie.indexOf(";", o);
                -1 == i && (i = t.length);
            }
            return decodeURI(t.substring(o + n.length, i));
        }
        function setGTM(e, t, n, o, i) {
            (e[o] = e[o] || []), e[o].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var r = t.getElementsByTagName(n)[0],
                a = t.createElement(n),
                s = "dataLayer" != o ? "&l=" + o : "";
            (a.async = !0), (a.src = "https://www.googletagmanager.com/gtm.js?id=" + i + s), r.parentNode.insertBefore(a, r);
        }
        var timer;
        function waitForOnetrustActiveGroups() {
            document.cookie.indexOf("OptanonConsent") > -1 && document.cookie.indexOf("groups=") > -1
                ? (clearTimeout(timer), setGTM(window, document, "script", "dataLayer", "GTM-TQ9H33K"))
                : (timer = setTimeout(waitForOnetrustActiveGroups, 250));
        }
        document.cookie.indexOf("OptanonConsent") > -1 && document.cookie.indexOf("groups=") > -1 ? setGTM(window, document, "script", "dataLayer", "GTM-TQ9H33K") : waitForOnetrustActiveGroups(),
            dataLayer.push({ event: "setUserId", userId: JSON.parse(atob(getCookie("nf_jwt").split(".")[1])).id });
    </script>
    <title>Redirect</title>
    <meta http-equiv="refresh" content="0;url=REDIRECT_URL" />
</head>
<body></body>
</html>
`;
module.exports =  redirectTemplate;