(function(){
    const APP_NAME = 'shortfuts';

    log('Initializing...');

    window.addEventListener('keydown', function(ev) {
        const keyCode = ev.keyCode;

        switch (keyCode) {
            case 67 /* c */:
                comparePrice();
                break;
            case 77 /* m */:
                listMinBin();
                break;
            default:
                break;
        }
    });

    /**
     * Lists the current item with a BIN price of 200.
     */
    function listMinBin() {
        log('Attempting to list current item for minimum BIN...');

        try {
            // Set BIN price to 200.
            const quickListPanelActions = getQuickListPanelActions();
            const binAction = quickListPanelActions.getElementsByClassName('panelActionRow')[2];
            const binActionInput = binAction.getElementsByTagName('input')[0];
            binActionInput.value = 200;

            // Tap "List Item" button.
            const buttons = quickListPanelActions.getElementsByTagName('button');
            const listItemButton = buttons[buttons.length - 2];
            tapElement(listItemButton);
        } catch (error) {
            log('Unable to list current item for minimum BIN.', true /* isError */);
            return;
        }
    }

    /**
     * Handler to invoke "Compare Price" button.
     */
    function comparePrice() {
        log('Attempting to search for current item to compare price...');

        try {
            // Tap "Compare Price" button.
            const quickListPanelActions = getQuickListPanelActions();
            const buttons = quickListPanelActions.getElementsByTagName('button');
            const comparePriceButton = buttons[buttons.length - 1];
            tapElement(comparePriceButton);
        } catch (error) {
            log('Unable to locate "Compare Price" button.', true /* isError */);
            return;
        }

        log('Successfully searched for current item.')
    }

    /**
     * Gets the quick list panel actions div.
     */
    function getQuickListPanelActions() {
        const quickListPanel = document.getElementsByClassName('QuickListPanel')[0];
        const quickListPanelActions = quickListPanel.getElementsByClassName('panelActions')[0];
        return quickListPanelActions;
    }

    /**
     * Logs a message to the console with app information.
     *
     * @param {string} message
     * @param {boolean} isError
     */
    function log(message, isError) {
        // Default to info.
        let logFunction = console.info;

        if (isError) {
            logFunction = console.error;
        }

        logFunction(`${APP_NAME}: ${message}`)
    }

    /**
     * Simulates a tap/click on an element.
     *
     * @param {HTMLElement} element
     */
    function tapElement(element) {
        sendTouchEvent(element, 'touchstart');
        sendTouchEvent(element, 'touchend');
    }

    /**
     * Dispatches a touch event on the element.
     * https://stackoverflow.com/a/42447620
     *
     * @param {HTMLElement} element
     * @param {string} eventType
     */
    function sendTouchEvent(element, eventType) {
        const touchObj = new Touch({
          identifier: 123,
          target: element,
          clientX: 0,
          clientY: 0,
          radiusX: 2.5,
          radiusY: 2.5,
          rotationAngle: 10,
          force: 0.5
        });

        const touchEvent = new TouchEvent(eventType, {
          cancelable: true,
          bubbles: true,
          touches: [touchObj],
          targetTouches: [touchObj],
          changedTouches: [touchObj],
          shiftKey: true
        });

        element.dispatchEvent(touchEvent);
      }
})();