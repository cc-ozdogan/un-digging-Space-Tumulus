document.addEventListener('DOMContentLoaded', function() {
    (function() {
        "use strict";
        var mousePos;

        document.onmousemove = handleMouseMove;
        setInterval(getMousePosition, 100); // setInterval repeats every X ms

        function handleMouseMove(event) {
            var eventDoc, doc, body;

            event = event || window.event; // IE-ism

            // If pageX/Y aren't available and clientX/Y are,
            // calculate pageX/Y - logic taken from jQuery.
            // (This is to support old IE)
            if (event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
            }

            mousePos = {
                x: event.pageX,
                y: event.pageY
            };
        }

        function getMousePosition() {
            var pos = mousePos;

            if (!pos) {
                // We haven't seen any movement yet, so don't add a duplicate dot
            } else {
                // Use pos.x and pos.y
                // Add a dot to follow the cursor
                var dot;
                dot = document.createElement('div');
                dot.className = "dot";
                dot.style.left = pos.x + "px";
                dot.style.top = pos.y + "px";
                document.body.appendChild(dot);
            }
        }
    })();
});
