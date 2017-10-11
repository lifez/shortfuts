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
            case 83 /* s */:
                storeInClub();
                break;
            case 81 /* q */:
                quickSell();
                break;
            case 40 /* down arrow */:
                move(ev);
                break;
            case 38 /* up arrow */:
                move(ev);
                break;
            case 8 /* backspace */:
                goBack();
                break;
            case 66 /* b */:
                buyBronzePack();
                break;
            default:
                break;
        }
    });

    /**
     * Buys a regular bronze pack.
     */
    function buyBronzePack() {
        log('Attempting to buy a bronze pack...');

        try {
            const bronzeTabButton = document.getElementsByClassName('TabMenuItem')[2];
            tapElement(bronzeTabButton);

            setTimeout(() => {
                const bronzePackButton = document.getElementsByClassName('currency call-to-action cCoins')[0];
                tapElement(bronzePackButton);

                setTimeout(() => {
                    const okButton = document.getElementsByClassName('Dialog')[0].getElementsByClassName('btn-flat')[1];
                    tapElement(okButton);
                }, getRandomWait());
            }, 200);
        } catch (error) {
            log('Unable to buy a bronze pack.', true /* isError */);
            return;
        }

        log('Successfully bought a bronze pack.');
    }

    /**
     * Goes back.
     */
    function goBack() {
        /**
         * Extra check for English language to only allow back button shortcut
         * on the "Search Results" page.
         */
        const pageTitle = document.getElementById('futHeaderTitle');
        if (document.getElementsByClassName('SearchResults').length === 0) {
            log('Not going back because we\'re not on the search results page.');
            return;
        }

        log('Attempting to go to the previous page...');

        try {
            const backButton = document.getElementsByClassName('btn-flat back headerButton')[0];
            tapElement(backButton);
        } catch (error) {
            log('Unable to go back.', true /* isError */);
            return;
        }

        log('Successfully went back.');
    }

    /**
     * Adds item selection to the list.
     *
     * @param {Event} ev
     */
    function move(ev) {
        log('Attempting to change the currently selected item...');

        try {
            const isDown = ev.keyCode === 40;

            // Get all items.
            const itemList = document.getElementsByClassName('itemList')[0];
            const items = Array.from(itemList.getElementsByClassName('listFUTItem'));

            // Get current index.
            let currentIndex = items.findIndex((item) => { return item.className.indexOf('selected') > -1; })

            if (isDown && currentIndex + 1 <= items.length) {
                const div = items[++currentIndex].getElementsByClassName('has-tap-callback')[0];
                tapElement(div);
            } else if (!isDown && currentIndex - 1 >= 0) {
                const div = items[--currentIndex].getElementsByClassName('has-tap-callback')[0];
                tapElement(div);
            }
        } catch (error) {
            log('Unable to change the currently selected item...', true /* isError */);
            return;
        }

        log('Successfully changed the currently selected item.');
    }

    /**
     * Quick sells the current item.
     */
    function quickSell() {
        log('Attempting to quick sell the current item...');

        try {
            // Tap "Quick Sell" button.
            const buttonArray = getDetailsPanelButtons();
            const quickSellButton = buttonArray[buttonArray.length - 1];
            tapElement(quickSellButton);

            setTimeout(() => {
                const okButton = document.getElementsByClassName('Dialog')[0].getElementsByClassName('btn-flat')[1];
                tapElement(okButton);
            }, getRandomWait());
        } catch (error) {
            log('Unable to locate "Quick Sell" button.', true /* isError */);
            return;
        }

        log('Successfully quick sold the current item.');
    }

    /**
     * Stores the current item in your club.
     */
    function storeInClub() {
        if (navigator.language.indexOf('en') !== 0) {
            alert('The "Send to My Club" shortcut is only available when the app is in English. Blame EA!');
            return;
        }

        log('Attempting to store current item in the club...');

        try {
            // Tap "Send to My Club" button.
            const buttonArray = getDetailsPanelButtons();
            const sendToMyClubButton = buttonArray.filter((button) => button.innerText.indexOf('Send to My Club') > -1)[0];
            tapElement(sendToMyClubButton);
        } catch (error) {
            log('Unable to locate "Send to My Club" button.', true /* isError */);
            return;
        }

        log('Successfully stored current item in the club.');
    }

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

        log('Successfully listed current item for minimum BIN.');
    }

    /**
     * Search for the current item to see what other ones on the market are going for.
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

        log('Successfully searched for current item.');
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
     * Gets the buttons in the details panel and returns them as an array.
     */
    function getDetailsPanelButtons() {
        const detailsPanel = document.getElementsByClassName('DetailPanel')[0];
        const detailsPanelButtons = detailsPanel.getElementsByTagName('button');
        const buttonArray = Array.from(detailsPanelButtons);
        return buttonArray;
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

    function getRandomWait() {
        return Math.floor(Math.random() * (300 - 150)) + 150;
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
          identifier: 'Keyboard shortcuts should be supported natively without an extension!',
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