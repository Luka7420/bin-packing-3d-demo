/**
 * This file contains the main application logic and state.
 * All API requests regarding PTVs loading space optimization happen here.
 */

// ⬇⬇⬇ STAVI SVOJ API KEY OVDE ⬇⬇⬇
const api_key = "RVVfZmQxMjY5NjIzZTViNDQ2MzhiYjE4M2M5YjFmMGVmMmQ6OTA5ZTMwZWItYWYzNC00OWZhLTkzMGQtNzZlMWEyNGRiNTA5";

// Demo mode: bypass API calls and use hardcoded data for offline demos.
const USE_LOAD_PLAN_API = true;
const DEMO_MODE = false;

// Load plan API configuration (Change LOAD_PLAN_ENDPOINT and LOAD_PLAN_REQUEST_BODY as needed)
const LOAD_PLAN_ENDPOINT = "/load-plan.json";
const LOAD_PLAN_REQUEST_BODY = {
    load_plan_id: "LP-TEST"
};

const DEMO_DATA = {
    request: {
        bins: [
            {
                id: "Kamion#0",
                numberOfInstances: 1,
                dimensions: { x: 240, y: 244, z: 1360 },
                maximumWeightCapacity: 20000 * 1000
            }
        ],
        items: [
            {
                id: "Artikal#0",
                numberOfInstances: 6,
                dimensions: { x: 80, y: 104, z: 120 },
                weight: 500 * 1000,
                destination: "Klijent A"
            },
            {
                id: "Artikal#1",
                numberOfInstances: 4,
                dimensions: { x: 120, y: 80, z: 60 },
                weight: 250 * 1000,
                destination: "Klijent B"
            },
            {
                id: "Artikal#2",
                numberOfInstances: 8,
                dimensions: { x: 60, y: 60, z: 100 },
                weight: 120 * 1000,
                destination: "Klijent C"
            },
            {
                id: "Artikal#3",
                numberOfInstances: 1,
                dimensions: { x: 200, y: 120, z: 150 },
                weight: 800 * 1000,
                destination: "Klijent D"
            }
        ]
    },
    response: {
        packedBins: [
            {
                binId: "Kamion#0",
                packedItems: [
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 0, y: 0, z: 0 } },
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 80, y: 0, z: 0 } },
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 160, y: 0, z: 0 } },
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 0, y: 104, z: 0 } },
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 80, y: 104, z: 0 } },
                    { itemId: "Artikal#0", dimensions: { x: 80, y: 104, z: 120 }, position: { x: 160, y: 104, z: 0 } },
                    { itemId: "Artikal#1", dimensions: { x: 120, y: 80, z: 60 }, position: { x: 0, y: 0, z: 120 } },
                    { itemId: "Artikal#1", dimensions: { x: 120, y: 80, z: 60 }, position: { x: 120, y: 0, z: 120 } },
                    { itemId: "Artikal#1", dimensions: { x: 120, y: 80, z: 60 }, position: { x: 0, y: 80, z: 120 } },
                    { itemId: "Artikal#1", dimensions: { x: 120, y: 80, z: 60 }, position: { x: 120, y: 80, z: 120 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 0, y: 0, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 60, y: 0, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 120, y: 0, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 180, y: 0, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 0, y: 60, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 60, y: 60, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 120, y: 60, z: 180 } },
                    { itemId: "Artikal#2", dimensions: { x: 60, y: 60, z: 100 }, position: { x: 180, y: 60, z: 180 } },
                    { itemId: "Artikal#3", dimensions: { x: 200, y: 120, z: 150 }, position: { x: 0, y: 0, z: 280 } }
                ],
                totalItemsVolume: 14774400,
                totalItemsWeight: 5760000,
                usedWeightCapacity: 28.8,
                usedVolumeCapacity: 18.55,
                loadingMeters: 2.4
            }
        ],
        itemsNotPacked: []
    }
};

const APIEndpoints = {
    // Sync endpoint – odmah vraća rezultat (nema async ID + status koraka)
    StartBinPacking: "https://api.myptv.com/binpacking/v1/bins"
};

const applyHeaders = (configuration) => ({
    ...configuration,
    headers: {
        "apiKey": api_key,
        ...(configuration ? { ...configuration.headers } : {})
    }
});

/**
 * This object represents the application state
 */
const appState = {
    bins: [],
    items: [],
    optimizedResult: { request: undefined, response: undefined },
    selectedBinIndex: 0
};

/**
 * Applications entry point, triggered by "window.onload" event
 */
const initializeApplication = () => {

    getElement("btn-add-bin").addEventListener("click", addBin);
    getElement("btn-add-item").addEventListener("click", addItem);

    getElement("btn-start-optimization").addEventListener("click", optimize);

    getElement("previous-bin").addEventListener("click", () => switchSelectedBin(-1));
    getElement("next-bin").addEventListener("click", () => switchSelectedBin(1));

    getElement("close-error-details").addEventListener("click", () => hideElement("error-log"));
    getElement("clear-data").addEventListener("click", () => clearAllData());

    window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        e.returnValue = "";
    });
    // switch izmedju demo i normalnog moda
    if (DEMO_MODE) {
        loadDemoData();
        optimize();
    } else if (USE_LOAD_PLAN_API) {
        optimize();
    }
};

const createRequest = () => {
    return {
        items: appState.items,
        bins: appState.bins
    };
};

const startOptimization = (focus, requestBody) =>
    fetch(
        APIEndpoints.StartBinPacking + "?focus=" + focus,
        applyHeaders({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
    ).then(response => response.ok ? response.json() : logError(response));

const fetchLoadPlan = () =>
    fetch(
        LOAD_PLAN_ENDPOINT,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    ).then(response => response.ok ? response.json() : logError(response))
        .then((data) => (data && data.record) ? data.record : data);

const mapDimensionsFromPlan = (dims) => ({
    x: dims.width,
    y: dims.height,
    z: dims.length
});

const mapPositionFromPlan = (pos) => ({
    x: pos.y,
    y: pos.z,
    z: pos.x
});

const mapLoadPlanToOptimization = (loadPlan) => {
    const container = loadPlan.container || {};
    const containerDims = container.dimensions_cm || {};
    const placedItems = loadPlan.placed_items || [];
    const unplannedItems = loadPlan.unplanned_items || [];
    const utilization = (loadPlan.summary && loadPlan.summary.utilization) || {};

    const binId = container.type || "B#0";
    const request = {
        bins: [
            {
                id: binId,
                numberOfInstances: 1,
                dimensions: mapDimensionsFromPlan(containerDims),
                maximumWeightCapacity: (container.max_weight_kg || 0) * 1000
            }
        ],
        items: placedItems.map((item) => ({
            id: item.item_id,
            numberOfInstances: 1,
            dimensions: mapDimensionsFromPlan(item.dimensions_cm || {}),
            weight: (item.weight_kg || 0) * 1000,
            destination: item.client_name || ""
        }))
    };

    const totalItemsVolume = placedItems.reduce((sum, item) => {
        const dims = item.dimensions_cm || {};
        return sum + (dims.length || 0) * (dims.width || 0) * (dims.height || 0);
    }, 0);
    const totalItemsWeight = placedItems.reduce((sum, item) => {
        return sum + (item.weight_kg || 0) * 1000;
    }, 0);

    const totalItemsLoaded = (loadPlan.summary && loadPlan.summary.total_items_loaded) || placedItems.length;
    const totalItemsUnloaded = (loadPlan.summary && loadPlan.summary.total_items_unloaded) || unplannedItems.length;

    const response = {
        packedBins: [
            {
                binId,
                packedItems: placedItems.map((item) => ({
                    itemId: item.item_id,
                    dimensions: mapDimensionsFromPlan(item.dimensions_cm || {}),
                    position: mapPositionFromPlan(item.position_cm || {})
                })),
                totalItemsVolume,
                totalItemsWeight,
                usedWeightCapacity: utilization.weight_percentage || 0,
                usedVolumeCapacity: utilization.volume_percentage || 0,
                loadingMeters: utilization.linear_meters_occupied || 0
            }
        ],
        itemsNotPacked: unplannedItems.map((item) => ({
            itemId: item.item_id,
            numberOfInstances: 1,
            weight: (item.weight_kg || 0) * 1000,
            dimensions: mapDimensionsFromPlan(item.dimensions_cm || {})
        })),
        totalItemsLoaded,
        totalItemsUnloaded
    };

    return { request, response };
};

// ✅ Sync optimize – nema polling-a, nema /status/{id}, nema /bins/{id}
const optimize = async () => {
    showElement("processing-indicator", "flex");

    if (USE_LOAD_PLAN_API) {
        const loadPlan = await fetchLoadPlan();
        if (!loadPlan) {
            return;
        }
        const mapped = mapLoadPlanToOptimization(loadPlan);
        appState.optimizedResult.request = mapped.request;
        appState.optimizedResult.response = mapped.response;

        handleResponse(
            $("#binViewer"),
            appState.optimizedResult.request,
            appState.optimizedResult.response
        );

        populateBinDetails();
        populateKPIs();
        showElement("optimization-results", "flex");
        hideElement("processing-indicator");
        return;
    }

    const requestBody = DEMO_MODE ? DEMO_DATA.request : createRequest();

    let optimizedResult = null;
    if (DEMO_MODE) {
        optimizedResult = DEMO_DATA.response;
    } else {
        const focusCtrl = getElement("focus");
        const focus = focusCtrl.options[focusCtrl.selectedIndex].value;
        optimizedResult = await startOptimization(focus, requestBody);
    }
    if (!optimizedResult) {
        // logError je već prikazao poruku i sakrio indikator
        return;
    }

    appState.optimizedResult.request = requestBody;
    appState.optimizedResult.response = optimizedResult;

    handleResponse(
        $("#binViewer"),
        appState.optimizedResult.request,
        appState.optimizedResult.response
    );

    populateBinDetails();
    populateKPIs();
    showElement("optimization-results", "flex");
    hideElement("processing-indicator");
};

const addBin = () => {
    const { items, bins } = appState;
    const bin = {
        id: "B#" + bins.length,
        numberOfInstances: parseInt(getElement("bin-number").value),
        dimensions: {
            x: parseInt(getElement("bin-dimension-x").value),
            y: parseInt(getElement("bin-dimension-y").value),
            z: parseInt(getElement("bin-dimension-z").value)
        },
        maximumWeightCapacity: parseInt(getElement("bin-capacity").value) * 1000
    };

    bins.push(bin);
    updateOverviewTable(
        "bins-overview",
        bin.id,
        bin.dimensions,
        bin.maximumWeightCapacity,
        bin.numberOfInstances
    );

    if (items.length && bins.length) {
        enableElement(["btn-start-optimization"]);
    }
};

const addItem = () => {
    const { items, bins } = appState;
    const item = {
        id: "I#" + items.length,
        numberOfInstances: parseInt(getElement("item-number").value),
        dimensions: {
            x: parseInt(getElement("item-dimension-x").value),
            y: parseInt(getElement("item-dimension-y").value),
            z: parseInt(getElement("item-dimension-z").value)
        },
        weight: parseInt(getElement("item-weight").value) * 1000
    };

    items.push(item);
    updateOverviewTable(
        "items-overview",
        item.id,
        item.dimensions,
        item.weight,
        item.numberOfInstances
    );

    if (items.length && bins.length) {
        enableElement(["btn-start-optimization"]);
    }
};

const updateOverviewTable = (tableId, id, dimensions, weight, count) => {
    const tbody = getElement(tableId).getElementsByTagName("tbody")[0];
    const row = tbody.insertRow();
    row.insertCell(0).innerText = id;
    row.insertCell(1).innerText = dimensions.x + "," + dimensions.y + "," + dimensions.z;
    row.insertCell(2).innerText = weight / 1000; // in kg
    row.insertCell(3).innerText = count;
};

const clearAllData = () => {
    appState.bins = [];
    appState.items = [];
    appState.optimizedResult = { request: undefined, response: undefined };
    appState.selectedBinIndex = 0;

    handleResponse($("#binViewer"), undefined, undefined);

    hideElement("optimization-results");
    disableElement(["btn-start-optimization"]);

    // --- Reset form to default values ---

    // Bin
    getElement("bin-dimension-x").value = 240;
    getElement("bin-dimension-y").value = 244;
    getElement("bin-dimension-z").value = 1360;
    getElement("bin-capacity").value = 20000;
    getElement("bin-number").value = 1;
    removeAllChildNodes(
        getElement("bins-overview").getElementsByTagName("tbody")[0]
    );

    // Item
    getElement("item-dimension-x").value = 80;
    getElement("item-dimension-y").value = 104;
    getElement("item-dimension-z").value = 120;
    getElement("item-weight").value = 500;
    getElement("item-number").value = 10;
    removeAllChildNodes(
        getElement("items-overview").getElementsByTagName("tbody")[0]
    );

    getElement("focus").selectedIndex = 1;

    enableElement(["btn-add-bin", "btn-add-item"]);

    if (DEMO_MODE) {
        loadDemoData();
    }
};

const switchSelectedBin = (step) => {
    const { selectedBinIndex } = appState;
    const usedBins = appState.optimizedResult.response.packedBins.length;

    let newIndex = selectedBinIndex + step;
    if (newIndex < 0) newIndex = usedBins - 1;
    if (newIndex > usedBins - 1) newIndex = 0;

    appState.selectedBinIndex = newIndex;
    changeBinView(newIndex);
    populateBinDetails();
};

const populateBinDetails = () => {
    const response = appState.optimizedResult.response;
    const selectedBin = response.packedBins[appState.selectedBinIndex];

    getElement("bin-index").innerText = "index: " + appState.selectedBinIndex;
    getElement("bin-id").innerText = selectedBin ? selectedBin.binId : "-";
    getElement("total-items-count").innerText = selectedBin
        ? selectedBin.packedItems.length
        : "-";
    getElement("total-items-volume").innerText = selectedBin
        ? (selectedBin.totalItemsVolume / 100 / 100 / 100).toFixed(3) + " \u33A5"
        : "-";
    getElement("total-items-weight").innerText = selectedBin
        ? selectedBin.totalItemsWeight / 1000 + " kg"
        : "-";
    getElement("used-weight-capacity").innerText = selectedBin
        ? selectedBin.usedWeightCapacity.toFixed(2) + " %"
        : "-";
    getElement("used-volume-capacity").innerText = selectedBin
        ? selectedBin.usedVolumeCapacity.toFixed(2) + " %"
        : "-";
    getElement("loading-meters").innerText = selectedBin
        ? selectedBin.loadingMeters.toFixed(2) + " m"
        : "-";
};

const populateKPIs = () => {
    const { request, response } = appState.optimizedResult;

    const totalAvailableBins = request.bins.reduce(
        (sum, bin) => sum + bin.numberOfInstances,
        0
    );
    const totalAvailableItems = request.items.reduce(
        (sum, item) => sum + item.numberOfInstances,
        0
    );

    const totalUsedBins = response.packedBins.length;
    const totalUnpackedItems = response.itemsNotPacked.reduce(
        (sum, item) => sum + item.numberOfInstances,
        0
    );

    getElement("used-bins").innerText = totalUsedBins;
    getElement("unused-bins").innerText = totalAvailableBins - totalUsedBins;
    if (response.totalItemsLoaded != null || response.totalItemsUnloaded != null) {
        getElement("packed-items").innerText =
            response.totalItemsLoaded != null ? response.totalItemsLoaded : "-";
        getElement("unpacked-items").innerText =
            response.totalItemsUnloaded != null ? response.totalItemsUnloaded : "-";
    } else {
        getElement("packed-items").innerText =
            totalAvailableItems - totalUnpackedItems;
        getElement("unpacked-items").innerText = totalUnpackedItems;
    }
};

const logError = async (response) => {
    const errorDetails = await response.json();
    getElement("error-details").innerHTML = JSON.stringify(
        errorDetails,
        null,
        2
    );
    showElement("error-log");
    hideElement("processing-indicator");
    return false;
};

const loadDemoData = () => {
    appState.bins = JSON.parse(JSON.stringify(DEMO_DATA.request.bins));
    appState.items = JSON.parse(JSON.stringify(DEMO_DATA.request.items));

    removeAllChildNodes(
        getElement("bins-overview").getElementsByTagName("tbody")[0]
    );
    removeAllChildNodes(
        getElement("items-overview").getElementsByTagName("tbody")[0]
    );

    for (const bin of appState.bins) {
        updateOverviewTable(
            "bins-overview",
            bin.id,
            bin.dimensions,
            bin.maximumWeightCapacity,
            bin.numberOfInstances
        );
    }

    for (const item of appState.items) {
        updateOverviewTable(
            "items-overview",
            item.id,
            item.dimensions,
            item.weight,
            item.numberOfInstances
        );
    }

    enableElement(["btn-start-optimization"]);
};

window.onload = initializeApplication;
