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
                if (ev.altKey) {
                    storeAllInClub();
                } else {
                    pressDetailsPanelButton('Send to My Club');
                }
                break;
            case 84 /* t */:
                pressDetailsPanelButton('Send to Transfer List');
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
            case 220 /* \ */:
                buyNow();
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
            // Only execute this shortcut if in the "Store" tab.
            const storeHub = document.getElementById('StoreHub');
            if (!storeHub) {
                log('Not on store page, so not trying to buy a pack.', true /* isError */);
                return;
            }

            const bronzeTabButton = document.getElementsByClassName('TabMenuItem')[2];
            tapElement(bronzeTabButton);

            setTimeout(() => {
                const bronzePackButton = document.getElementsByClassName('currency call-to-action cCoins')[0];
                tapElement(bronzePackButton);

                // Press OK.
                confirmDialog();
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
        if (document.getElementsByClassName('SearchResults').length === 0) {
            log('Not going back because we\'re not on the search results page.');
            return;
        }

        log('Attempting to go to the previous page...');

        try {
            const backButton = document.getElementsByClassName('btn-flat back headerButton')[0];
            tapElement(backButton);
        } catch (error) {
            log(error, true /* isError */);
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
            let itemList;
            if (isSearchResultPage()) {
                itemList = document.getElementsByClassName('paginated-item-list')[0];
            } else {
                itemList = document.getElementsByClassName('itemList')[0];
            }
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
            log(error);
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

            // Press OK.
            confirmDialog();
        } catch (error) {
            log('Unable to locate "Quick Sell" button.', true /* isError */);
            return;
        }

        log('Successfully quick sold the current item.');
    }

    /**
     * Presses a button in the item details panel, based on a given button label.
     */
    function pressDetailsPanelButton(buttonLabel) {
        if (navigator.language.indexOf('en') !== 0) {
            alert(`The "${buttonLabel}" shortcut is only available when the app is in English. Blame EA!`);
            return;
        }

        log(`Attempting to press "${buttonLabel}" button...`);

        try {
            // Tap the relevant button.
            const buttonArray = getDetailsPanelButtons();
            const button = buttonArray.filter((button) => button.innerText.indexOf(buttonLabel) > -1)[0];
            tapElement(button);
        } catch (error) {
            log(`Unable to locate the "${buttonLabel}" button.`, true /* isError */);
            return;
        }

        log(`Successfully pressed "${buttonLabel}" button.`);
    }


    /**
     * Executes "Buy Now" on the selected on "Search Results" page.
     */
    function buyNow() {
        log('Attempting to "Buy Now" currently selected item...');

        if (document.getElementsByClassName('SearchResults').length === 0) {
            log(`Not exeucting "Buy Now" because we're not on the "Search Results" page.`, true /* isError */);
            return;
        }

        try {
            // Tap "Buy Now" button.
            const buyNowButton = getBuyNowButton();
            tapElement(buyNowButton);

            // Press OK.
            confirmDialog();
        } catch (error) {
            log('Unable to locate "Buy Now" button.', true /* isError */);
            return;
        }

        log('Successfully executed "Buy Now" on selected item.');
    }

    /**
     * Stores all remaining items in the club.
     */
    function storeAllInClub() {
        log('Attempting to store remaining items in the club...');
        let prevItemCount = 0;

        try {
            const itemList = document.getElementsByClassName('itemList')[0];
            const items = Array.from(itemList.getElementsByClassName('listFUTItem'));

            items.forEach(function(item, itemIndex) {
                setTimeout(() => {
                    storeInClub();
                }, itemIndex * getRandomLongerWait());
            }, this);
        } catch (error) {
            log('Unable to store remaining items in club.', true /* isError */);
        }

        log('Successfully stored remaining items in club.');
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
     * Gets "Buy Now" button.
     */
    function getBuyNowButton() {
        const buyNowButton = document.getElementsByClassName('list')[1];
        return buyNowButton;
    }

    /**
     * Determiens if user is currently on the "Search Results" page.
     */
    function isSearchResultPage(){
        const title = document.getElementById('futHeaderTitle');
        return title && title.innerHTML == 'Search Results';
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

    function getRandomLongerWait() {
        return Math.floor(Math.random() * (2000 - 1000)) + 1000;
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

    /**
     * Presses "OK" button in confirmation dialog.
     */
    function confirmDialog() {
        setTimeout(() => {
            try{
                const okButton = document.getElementsByClassName('Dialog')[0].getElementsByClassName('btn-flat')[1];
                tapElement(okButton);
            } catch (error) {
                log(error, true /* isError */);
            }
        }, getRandomWait());
    }
})();