var app = angular.module('reportingApp', []);

app.controller('ScreenshotReportController', function ($scope) {
    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = undefined; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        }

    }


    $scope.inlineScreenshots = false;
    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        var arr = str.split('|');
        str = "";
        for (var i = arr.length - 2; i > 0; i--) {
            str += arr[i] + " > ";
        }
        return str.slice(0, -3);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };


    this.getShortDescription = function (str) {
        return str.split('|')[0];
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };


    var results = [
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "2a7d97eee9d9b22638b811ebf0480770",
        "instanceId": 11492,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Profile icon taking too long to appear in the DOM\nWait timed out after 10023ms"
        ],
        "trace": [
            "TimeoutError: Profile icon taking too long to appear in the DOM\nWait timed out after 10023ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:32:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js 42504:12 \"%s\\nsessionId: %s\" \"INTERNAL_SERVER_ERROR\" \"5bcca604627b04fd4d52e845\"",
                "timestamp": 1540138526376,
                "type": ""
            }
        ],
        "screenShotFile": "009c009d-0059-0031-0088-002000ec0009.png",
        "timestamp": 1540138494870,
        "duration": 43805
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "2a7d97eee9d9b22638b811ebf0480770",
        "instanceId": 11492,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"profile\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: <anonymous>\n    at Timeout.pollCondition [as _onTimeout] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)\nFrom: Task: Profile icon taking too long to appear in the DOM\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at KabooPageObject.verifyUserIsLogged (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:33:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:41:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00050074-00e6-00b8-009e-008d00160009.png",
        "timestamp": 1540138539849,
        "duration": 21977
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0e7b62bcba7349fa6461ff16774d7e2e",
        "instanceId": 7860,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: browser.switchTo(...).alert(...).authenticateUsing is not a function",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "TypeError: browser.switchTo(...).alert(...).authenticateUsing is not a function\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:17:36)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "009b0089-00a5-00c1-002f-0034006a0004.png",
        "timestamp": 1540139346743,
        "duration": 3153
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0e7b62bcba7349fa6461ff16774d7e2e",
        "instanceId": 7860,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: browser.switchTo(...).alert(...).authenticateUsing is not a function",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "TypeError: browser.switchTo(...).alert(...).authenticateUsing is not a function\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:17:36)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:23:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0014006d-0071-00ee-00cb-005200920020.png",
        "timestamp": 1540139350314,
        "duration": 3030
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0ece64f51b8b8b80ccd2a3f433a250c2",
        "instanceId": 9272,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: browser.switchTo(...).alert.authenticateUsing is not a function",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "TypeError: browser.switchTo(...).alert.authenticateUsing is not a function\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:17:34)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0035005e-008c-000c-0035-0085001a00c2.png",
        "timestamp": 1540139423572,
        "duration": 3075
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0ece64f51b8b8b80ccd2a3f433a250c2",
        "instanceId": 9272,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: browser.switchTo(...).alert.authenticateUsing is not a function",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "TypeError: browser.switchTo(...).alert.authenticateUsing is not a function\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:17:34)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:23:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0060002d-00ff-0017-00e1-001700da0091.png",
        "timestamp": 1540139427005,
        "duration": 3025
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0c2aa2406ed581e7228caa4f208957fb",
        "instanceId": 7632,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Wait timed out after 3023ms",
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 3023ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:17)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"live-casino\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139845817,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139846287,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847077,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847115,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847115,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847128,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847170,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847171,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847171,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847189,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847189,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847190,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847208,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847208,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847209,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847229,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847230,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847233,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847246,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847247,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847249,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847260,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847261,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847263,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847278,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847281,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847296,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847296,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847299,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847308,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847310,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847312,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847322,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847323,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847327,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139847354,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139847354,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848414,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848427,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848427,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848428,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848435,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848437,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848447,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848477,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848477,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848478,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848478,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848478,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540139848479,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540139848567,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848672,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848673,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848674,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848740,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848775,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139848776,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139848776,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139850431,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139850431,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139850432,
                "type": ""
            }
        ],
        "screenShotFile": "008d0092-00f8-0070-000d-005900310097.png",
        "timestamp": 1540139836165,
        "duration": 26726
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0c2aa2406ed581e7228caa4f208957fb",
        "instanceId": 7632,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Wait timed out after 3007ms",
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 3007ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:17)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[name=\"email\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:23:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139866956,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867151,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867230,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867291,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867292,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867304,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867335,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867336,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867348,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867374,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867374,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867374,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867390,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867391,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867394,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867408,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867409,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867412,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867425,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867426,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867428,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867439,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867440,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867442,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867454,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867455,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867458,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867472,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867473,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867477,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139867491,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867491,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867493,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867506,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867508,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867511,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867522,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867523,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867537,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867547,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867556,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867583,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867593,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540139867657,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540139867735,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867777,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867790,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867792,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867806,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867806,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139867808,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139867818,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139869506,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139869547,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139869548,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Timer.setTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:18011:18)\\n    at Timer.EventEmitter.emit (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:4063:17)\\n    at timeChange (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43255:10)\\n    at updateTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43265:7)\"",
                "timestamp": 1540139880476,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139880476,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139880481,
                "type": ""
            }
        ],
        "screenShotFile": "00bb00b3-00fb-00f7-00d9-0096004300d3.png",
        "timestamp": 1540139866419,
        "duration": 17381
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "bc8e3a821a1c0e725b9cd59f9eeb5302",
        "instanceId": 14820,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Wait timed out after 3006ms",
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 3006ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:17)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"live-casino\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139910747,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139910923,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911337,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911356,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911356,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911357,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911384,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911386,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911420,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911464,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911464,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911482,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911482,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911483,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911483,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911502,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911504,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911509,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911523,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911524,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911527,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911541,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911542,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911545,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911558,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911559,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911562,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911574,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911576,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911582,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911598,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911599,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911601,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911633,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911633,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911634,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911646,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911646,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911649,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139911657,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911658,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540139911663,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911724,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911739,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911741,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540139911743,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911795,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911811,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911811,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911812,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911822,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139911832,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139911844,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139913325,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139913334,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139913335,
                "type": ""
            }
        ],
        "screenShotFile": "00c30083-00bd-0053-0078-00ef007e00c1.png",
        "timestamp": 1540139907679,
        "duration": 19914
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "bc8e3a821a1c0e725b9cd59f9eeb5302",
        "instanceId": 14820,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Wait timed out after 3054ms",
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 3054ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:17)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[name=\"email\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:23:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139931575,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932146,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932199,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932236,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932236,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932236,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932269,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932269,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932279,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932310,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932310,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932310,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932343,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932345,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932348,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932367,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932368,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932370,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932385,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932386,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932391,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932400,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932401,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932404,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932419,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932420,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932424,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932435,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932436,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932442,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932459,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932460,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932463,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540139932478,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932479,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932486,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932498,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932499,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932501,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932513,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932514,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932520,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932532,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932533,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932537,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932549,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932551,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540139932580,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540139932684,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932721,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932731,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932747,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932764,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932778,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139932804,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139932804,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139934564,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139934564,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139934565,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Timer.setTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:18011:18)\\n    at Timer.EventEmitter.emit (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:4063:17)\\n    at timeChange (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43255:10)\\n    at updateTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43265:7)\"",
                "timestamp": 1540139941443,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540139942395,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540139942395,
                "type": ""
            }
        ],
        "screenShotFile": "00a000eb-00c4-005e-00df-00a500a300a9.png",
        "timestamp": 1540139930694,
        "duration": 17723
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "a1da8e106b1aecd9d4bf51562ac5f29f",
        "instanceId": 9716,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Angular could not be found on the page https://qatest.staging.kaboo.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "Error: Angular could not be found on the page https://qatest.staging.kaboo.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load\n    at executeAsyncScript_.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:720:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/ - Failed to load resource: the server responded with a status of 401 ()",
                "timestamp": 1540140008339,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/favicon.ico - Failed to load resource: the server responded with a status of 401 ()",
                "timestamp": 1540140008623,
                "type": ""
            }
        ],
        "screenShotFile": "0081002f-00ca-009d-00bb-0004003f0003.png",
        "timestamp": 1540139998649,
        "duration": 23080
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "75a369deef8af0c5eeb222399eaa324a",
        "instanceId": 14680,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //label[@for='consent_6'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //label[@for='consent_6'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getLocation] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getLocation] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.checkTermsBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:97:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:21:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0075003b-00ce-00d0-0036-005500460081.png",
        "timestamp": 1540141487452,
        "duration": 28599
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "75a369deef8af0c5eeb222399eaa324a",
        "instanceId": 14680,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bd0010-0056-000c-00a0-003e00e4006a.png",
        "timestamp": 1540141519683,
        "duration": 15211
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "46d3754f8ed6ff686fa5fd3f38815ea8",
        "instanceId": 10424,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: Profile icon taking too long to appear in the DOM\nWait timed out after 10003ms"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "TimeoutError: Profile icon taking too long to appear in the DOM\nWait timed out after 10003ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:32:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js 42504:12 \"%s\\nsessionId: %s\" \"INTERNAL_SERVER_ERROR\" \"5bccb20108c3f4d8570a27c7\"",
                "timestamp": 1540141594931,
                "type": ""
            }
        ],
        "screenShotFile": "002e0067-00cb-001e-00d4-00b2006800db.png",
        "timestamp": 1540141564506,
        "duration": 42115
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "46d3754f8ed6ff686fa5fd3f38815ea8",
        "instanceId": 10424,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0038008c-00e8-00bb-0043-006b0074007c.png",
        "timestamp": 1540141608154,
        "duration": 14493
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "acb5bac98d8c8df0a6669de16879b689",
        "instanceId": 14532,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10016ms"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "TimeoutError: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10016ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM on registration\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:32:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js 42504:12 \"%s\\nsessionId: %s\" \"INTERNAL_SERVER_ERROR\" \"5bccb5f5f067a7f3369bf057\"",
                "timestamp": 1540142605102,
                "type": ""
            }
        ],
        "screenShotFile": "00580056-00c8-0054-00f6-00bd0098007a.png",
        "timestamp": 1540142576361,
        "duration": 41224
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "acb5bac98d8c8df0a6669de16879b689",
        "instanceId": 14532,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e2006f-0090-0026-0002-00d100e20099.png",
        "timestamp": 1540142618118,
        "duration": 19671
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "17e64bf62f50ba0a5d9e73821e61852d",
        "instanceId": 7572,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: runtime is not defined",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "ReferenceError: runtime is not defined\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:9)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00a200de-00c4-00c3-004a-00150083001a.png",
        "timestamp": 1540142696255,
        "duration": 3636
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "17e64bf62f50ba0a5d9e73821e61852d",
        "instanceId": 7572,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: runtime is not defined",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "ReferenceError: runtime is not defined\n    at KabooPageObject.navigateToURL (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:16:9)\n    at UserContext.beforeEach (E:\\Protractor test\\Protractor-test\\spec.js:7:13)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:24:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00b600c1-00e3-0015-008a-005d009000e9.png",
        "timestamp": 1540142700278,
        "duration": 3036
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "11e17bcc9449764ae0ab5d99a4facf2f",
        "instanceId": 9492,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"live-casino\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082577,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082577,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540143082578,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082578,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082578,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082579,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082579,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082580,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082580,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082580,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082581,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082581,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082581,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082582,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082582,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082582,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082583,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082583,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082584,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082584,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082584,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082584,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082585,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082586,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082586,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082586,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082587,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082587,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082587,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082587,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082588,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082588,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082588,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082588,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082589,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082589,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082589,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143082590,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082590,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082590,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082590,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082591,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082591,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082591,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082591,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082593,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082593,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540143082593,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082599,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082623,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082741,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082785,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082789,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143082798,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143082800,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143084502,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143084503,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143084503,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at ChildScope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at HTMLInputElement.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:39288:21)\\n    at defaultHandlerWrapper (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:14725:11)\\n    at HTMLInputElement.eventHandler (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:14713:9)\"",
                "timestamp": 1540143093691,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at ChildScope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at HTMLInputElement.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:39288:21)\\n    at defaultHandlerWrapper (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:14725:11)\\n    at HTMLInputElement.eventHandler (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:14713:9)\"",
                "timestamp": 1540143093698,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143093699,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at setDevice (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41742:9)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41749:7\"",
                "timestamp": 1540143094057,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143094057,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540143094103,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143094142,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143094157,
                "type": ""
            }
        ],
        "screenShotFile": "008200da-0062-00ee-00ac-00f30012002a.png",
        "timestamp": 1540143077914,
        "duration": 19298
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "11e17bcc9449764ae0ab5d99a4facf2f",
        "instanceId": 9492,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[name=\"email\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:19:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143099845,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100009,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100141,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100142,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100142,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100142,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100142,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100143,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100143,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100143,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100143,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100146,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100168,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100169,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100172,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100185,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100186,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100188,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100197,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100198,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100202,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100211,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100212,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100215,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100224,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100225,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100227,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100252,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100253,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100255,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100264,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100265,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100268,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143100277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100278,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100280,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100290,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100291,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100298,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100310,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100311,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100320,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100327,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100328,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540143100344,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100489,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100489,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100489,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540143100489,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100490,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100490,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100491,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100491,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143100592,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143100593,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143102291,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143102298,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143102299,
                "type": ""
            }
        ],
        "screenShotFile": "00e20015-006e-00e6-0012-006200ad004f.png",
        "timestamp": 1540143099284,
        "duration": 14339
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "d7264ad084dfa7edf13379adfcf4032a",
        "instanceId": 1696,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"live-casino\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131995,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131995,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131995,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131996,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131997,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131997,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540143131997,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131997,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143131997,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143131999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132000,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132001,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132002,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540143132003,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132003,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132003,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132004,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132004,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132004,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132005,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132005,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132006,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143132006,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143132007,
                "type": ""
            }
        ],
        "screenShotFile": "001100d0-00b5-0016-006f-00e100950057.png",
        "timestamp": 1540143124168,
        "duration": 21925
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "d7264ad084dfa7edf13379adfcf4032a",
        "instanceId": 1696,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[name=\"email\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:20:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150817,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150818,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150819,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150819,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150820,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150820,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150821,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150821,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150822,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150823,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150823,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150824,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150825,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150825,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150826,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150826,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150827,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150828,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150828,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150829,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150829,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150830,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150831,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150831,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150831,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150832,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150832,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150833,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150833,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150834,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150834,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150834,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150835,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540143150835,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150836,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150836,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150837,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150837,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150838,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150838,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150839,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150839,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150839,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150840,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540143150841,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150846,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150848,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150848,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540143150849,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150850,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150850,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150851,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150851,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150851,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150852,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150852,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150855,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540143150855,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540143150855,
                "type": ""
            }
        ],
        "screenShotFile": "004600fd-00ab-00c1-00f3-001200d6004c.png",
        "timestamp": 1540143146725,
        "duration": 18211
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "284d356578195c6da89108b7db4cc193",
        "instanceId": 10604,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: No element found using locator: By(css selector, *[id=\"live-casino\"])"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "NoSuchElementError: No element found using locator: By(css selector, *[id=\"live-casino\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at Timeout.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4283:11)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00680077-0021-0015-00f9-00fb009d00cc.png",
        "timestamp": 1540143273605,
        "duration": 103155
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "284d356578195c6da89108b7db4cc193",
        "instanceId": 10604,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0020008f-005b-0022-000e-009000ae0058.png",
        "timestamp": 1540143378282,
        "duration": 15361
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "284c44ad6b997d456b380cbec80b6c90",
        "instanceId": 14972,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[id=\"live-casino\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770605,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770606,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770606,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770606,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770606,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770608,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770608,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770608,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770608,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540144770609,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770609,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770609,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770609,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770609,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770610,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770611,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770613,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770613,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770613,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770613,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770613,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770614,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770614,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770614,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770614,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144770614,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770615,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770616,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770618,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770618,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770618,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770618,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770619,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770621,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144770621,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144770621,
                "type": ""
            }
        ],
        "screenShotFile": "00760036-00bf-00b9-0060-000c00230080.png",
        "timestamp": 1540144762357,
        "duration": 22372
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "284c44ad6b997d456b380cbec80b6c90",
        "instanceId": 14972,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=70.0.3538.67)\n  (Driver info: chromedriver=2.43.600210 (68dcf5eebde37173d4027fa8635e332711d2874a),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, *[name=\"email\"])\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:20:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'replaceState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789267,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789267,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789267,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789267,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789268,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789268,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789269,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789269,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789269,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789270,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789270,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789270,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789270,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789272,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789272,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789272,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789272,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789272,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789273,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789275,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789275,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at done (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23059:47)\\n    at completeRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23261:7)\\n    at XMLHttpRequest.requestLoaded (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:23194:9)\"",
                "timestamp": 1540144789275,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789276,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789276,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789276,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789276,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789278,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789278,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789278,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:24323:9\\n    at Array.\\u003Canonymous> (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7690:21)\\n    at MutationObserver.nextTick (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:7340:18)\"",
                "timestamp": 1540144789279,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789282,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789282,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789282,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:41763:14\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:37724:13\"",
                "timestamp": 1540144789282,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789283,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789283,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789284,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789284,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789285,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789286,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789286,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789287,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!\\nWatchers fired in the last 5 iterations: []\\nhttp://errors.angularjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:11296:12\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28790:19)\\n    at Scope.$apply (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:29018:24)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:30849:36\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144789287,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144789287,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24975:15\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at ChildScope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at Timer.setTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:18011:18)\\n    at Timer.EventEmitter.emit (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:4063:17)\\n    at timeChange (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43255:10)\\n    at updateTime (https://kaboo:flappybird@qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js:43265:7)\"",
                "timestamp": 1540144803380,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 25147:23 \"Error: Failed to execute 'pushState' on 'History': A history state object with URL 'https://qatest.staging.kaboo.com/en' cannot be created in a document with origin 'https://qatest.staging.kaboo.com' and URL 'https://kaboo:flappybird@qatest.staging.kaboo.com/'.\\n    at Browser.self.url (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17295:56)\\n    at setBrowserUrlWithFallback (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24846:18)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:24940:11\\n    at Scope.$eval (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28910:28)\\n    at Scope.$digest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28723:31)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:28949:26\\n    at completeOutstandingRequest (https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17192:10)\\n    at https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js:17471:7\"",
                "timestamp": 1540144803381,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://kaboo:flappybird@qatest.staging.kaboo.com/js/vendor-167d396505.min.js 11295:11 Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reache…larjs.org/1.5.8/$rootScope/infdig?p0=10&p1=%5B%5D",
                "timestamp": 1540144803381,
                "type": ""
            }
        ],
        "screenShotFile": "00c800ee-004f-00cf-0089-0046007300f0.png",
        "timestamp": 1540144785324,
        "duration": 18040
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "sessionId": "f301fa52-72ad-4c3e-842a-5e8a42d8af11",
        "instanceId": 5336,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10000ms"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "TimeoutError: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10000ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM on registration\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:32:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "001600fe-001e-00f2-0034-0022002300a8.png",
        "timestamp": 1540144847759,
        "duration": 49785
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "sessionId": "f301fa52-72ad-4c3e-842a-5e8a42d8af11",
        "instanceId": 5336,
        "browser": {
            "name": "firefox"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000f00e5-00be-00d0-00a0-00ff004700d8.png",
        "timestamp": 1540144898476,
        "duration": 20167
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "1ffdf4723fa21718cd9adfbc34cb80c0",
        "instanceId": 12808,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10022ms"
        ],
        "trace": [
            "TimeoutError: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10022ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM on registration\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:32:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js 42504:12 \"%s\\nsessionId: %s\" \"INTERNAL_SERVER_ERROR\" \"5bccbf9e3cf1060194c7a0ca\"",
                "timestamp": 1540145079942,
                "type": ""
            }
        ],
        "screenShotFile": "00c100c2-00fd-00b5-0092-001400dd0079.png",
        "timestamp": 1540145040297,
        "duration": 52222
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "1ffdf4723fa21718cd9adfbc34cb80c0",
        "instanceId": 12808,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f000f7-0000-0040-008f-003200bb0044.png",
        "timestamp": 1540145093090,
        "duration": 14497
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "sessionId": "051349f0-ec6d-41ec-ac4c-5f11e9440890",
        "instanceId": 2576,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: Angular could not be found on the page https://qatest.staging.kaboo.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "Error: Angular could not be found on the page https://qatest.staging.kaboo.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load\n    at executeAsyncScript_.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:720:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at SignUpPage.clickOnRegBtn (E:\\Protractor test\\Protractor-test\\SignUpPage.js:77:21)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:14:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0021004f-00f4-00d2-0061-00e000e5000c.png",
        "timestamp": 1540145166743,
        "duration": 20945
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": false,
        "pending": false,
        "sessionId": "051349f0-ec6d-41ec-ac4c-5f11e9440890",
        "instanceId": 2576,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: [Exception... \"Component not initialized\"  nsresult: \"0xc1f30001 (NS_ERROR_NOT_INITIALIZED)\"  location: \"JS frame :: chrome://marionette/content/modal.js :: get window :: line 143\"  data: no]\nBuild info: version: '3.14.0', revision: 'aacccce0', time: '2018-08-02T20:13:22.693Z'\nSystem info: host: 'DESKTOP-2GGPF6V', ip: '192.168.0.107', os.name: 'Windows 10', os.arch: 'amd64', os.version: '10.0', java.version: '1.8.0_121'\nDriver info: driver.version: unknown",
            "Failed: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\""
        ],
        "trace": [
            "WebDriverError: [Exception... \"Component not initialized\"  nsresult: \"0xc1f30001 (NS_ERROR_NOT_INITIALIZED)\"  location: \"JS frame :: chrome://marionette/content/modal.js :: get window :: line 143\"  data: no]\nBuild info: version: '3.14.0', revision: 'aacccce0', time: '2018-08-02T20:13:22.693Z'\nSystem info: host: 'DESKTOP-2GGPF6V', ip: '192.168.0.107', os.name: 'Windows 10', os.arch: 'amd64', os.version: '10.0', java.version: '1.8.0_121'\nDriver info: driver.version: unknown\n    at Object.checkLegacyResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: WebDriver.navigate().to(data:text/html,<html></html>)\n    at thenableWebDriverProxy.schedule (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Navigation.to (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1133:25)\n    at thenableWebDriverProxy.get (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:988:28)\n    at driver.controlFlow.execute.then.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:675:32)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\n    at Spec.queueRunnerFactory (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:909:35)\n    at Spec.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:526:10)\n    at UserContext.fn (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:5340:37)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at QueueRunner.execute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4199:10)\nFrom asynchronous test: \nError\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:6:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:529:3)\n    at Module.require (internal/modules/cjs/loader.js:636:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine\\lib\\jasmine.js:93:5",
            "Error: Error while waiting for Protractor to sync with the page: \"both angularJS testability and angular testability are undefined.  This could be either because this is a non-angular page or because your test involves client-side navigation, which can interfere with Protractor's bootstrapping.  See http://git.io/v4gXM for details\"\n    at runWaitForAngularScript.then (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:463:23)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as sendKeys] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at KabooPageObject.setUsername (E:\\Protractor test\\Protractor-test\\KabooPageObject.js:20:18)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:38:14)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"login registrated user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:37:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:36:2)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f700ad-0067-00de-0020-00ec00f900bf.png",
        "timestamp": 1540145187887,
        "duration": 3029
    },
    {
        "description": "registers new customer|Kaboo signup form",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fcaf80aa96a90ecad633bd24a4d9f3a0",
        "instanceId": 9860,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": [
            "Failed: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10017ms"
        ],
        "trace": [
            "TimeoutError: Profile icon taking too long to appear in the DOM on registration\nWait timed out after 10017ms\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Profile icon taking too long to appear in the DOM on registration\n    at scheduleWait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at SignUpPage.verifyUserIsRegistered (E:\\Protractor test\\Protractor-test\\SignUpPage.js:26:17)\n    at UserContext.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:33:16)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"registers new customer\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:16:3)\n    at addSpecsToSuite (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\Maketo\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (E:\\Protractor test\\Protractor-test\\spec.js:15:1)\n    at Module._compile (internal/modules/cjs/loader.js:688:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)\n    at Module.load (internal/modules/cjs/loader.js:598:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://qatest.staging.kaboo.com/js/kaboo-e92723491e.min.js 42504:12 \"%s\\nsessionId: %s\" \"INTERNAL_SERVER_ERROR\" \"5bccc5cf91fe9e0e58ab9d02\"",
                "timestamp": 1540146664778,
                "type": ""
            }
        ],
        "screenShotFile": "00670085-002d-007a-0092-0043001d0047.png",
        "timestamp": 1540146616724,
        "duration": 60608
    },
    {
        "description": "login registrated user|Kaboo login form",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fcaf80aa96a90ecad633bd24a4d9f3a0",
        "instanceId": 9860,
        "browser": {
            "name": "chrome",
            "version": "70.0.3538.67"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009e005a-0039-008e-002b-002d00bd00fe.png",
        "timestamp": 1540146678091,
        "duration": 15898
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.sortSpecs();
});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            countLogMessages(item);

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                }

            }
        }

        return filtered;
    };
});

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
        return;
    }

    if (getSpec(item.description) != getSpec(prevItem.description)) {
        item.displaySpecName = true;
        return;
    }
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};
