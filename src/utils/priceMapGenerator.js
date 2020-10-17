export function populateDefaultPriceMap() {
    if (localStorage.getItem("MARKET_ITEMS_SIMPLE")) {
        var itemNames = JSON.parse(localStorage.getItem("MARKET_ITEMS_SIMPLE"));
        var defaultPriceMap = {};
        itemNames.forEach((itemName) => {
            defaultPriceMap[itemName] = 0;
        });
        console.log("price map initialised successfully!");
        return defaultPriceMap;
    }
    else {
        console.error("price map failed to initialise as no items metadata was found!");
    }
}