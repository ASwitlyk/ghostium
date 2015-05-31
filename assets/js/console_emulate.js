$(document).ready(function() {


	// accepts a string to see if it starts with <span
	function checkForSpan(str) {
		if(str.substr(0, 5) == '<span') {
			return true;
		} else {
			false;
		}
	}

	// accepts a SPAN string, returns true if string contains class="code-line"
	function checkSpanForClassLine(str) {
		if(str.search(/code-line/) == -1) {
			return false;
		} else {
			return true;
		}
	}

	// get's last span class="code-line"
	// might not need this
	function getLastSpanClassLine() {
		var span = $('.code-line:last');
	}


	// forEach flags
	var currentSpanLine = false,
		currentInnerSpan,
		codeContainerNode = $('.code-container'),
		txtCursorNode = $('<span id="txtcursor" class="code-white">|</span>'),
		blinkIntervalId = 0,
		iterateCodeObjTimeoutId = 0,
		// keep track of all timeout Ids for each item in array (when sent to parseArrayItems)
		arrItemTimeoutIds = [],
		// need to keep track of fading Ids
		fadingTimeoutIds = [];



	var intervalTime = 500;

	function insertTxtCursorandBlink() {
		codeContainerNode.html(txtCursorNode);
		blinkIntervalId = setInterval(function(tc) {
			var hidden = false;
			return function() {
				if(!hidden) {
					tc.hide();
					hidden = true;
				} else {
					tc.show();
					hidden = false;
				}
			}
		}(txtCursorNode), 500)
	}

	function clearCoverContainerStopAnimation() {

		// stop blinking
		clearInterval(blinkIntervalId);
		// stop next Obj Iteration
		clearTimeout(iterateCodeObjTimeoutId);
		// stop next arr iteration
		clearTimeout(arrTimeoutId);
		// clear HTML from code container
		codeContainerNode.html('')
		// stop all timeoutsIds running for the array iteration
		arrItemTimeoutIds.forEach(function(v, i, a) {
			clearTimeout(v);
		});
		// stop all pending fading animations
		fadingTimeoutIds.forEach(function(v, i, a) {
			clearTimeout(v);
		});
		// reset fadingTimeoutIds to empty array
		fadingTimeoutIds = [];

	}

	function startConsoleAnimation() {
		insertTxtCursorandBlink();
		iterateCodeObjTimeoutId = setTimeout(iterateCodeObj, 1000);
	}

	function addBlockToCurrentSpanLine() {
		currentSpanLine.addClass("code-block");
	}

	function addCodeBlockClassToEL(el) {
		el.addClass("code-block");
	}

	// Parse items in array
	function parseArrayItems(v, i, a) {

		if(checkForSpan(v)) {
			// is value a span class="code-line"
			if(checkSpanForClassLine(v)) {
				// if not first currentSpanLine, set add block class to current Span Line before reassigning
				if(currentSpanLine) {

					setTimeout(function(el) {
						return function() {
							addCodeBlockClassToEL(el);
						}
					}(currentSpanLine), intervalTime+50);

					// currentSpanLine.addClass("code-block");
				}
				currentSpanLine = $(v);
				// insert before txtCursor
				txtCursorNode.before(currentSpanLine);

			} else {
				// insert span into current Span Line
				currentInnerSpan = $(v);
				currentSpanLine.append(currentInnerSpan);
			}

		} else {  // will be a string of characters, insert them into currentInnerSpan
			// add each character in on at a time
			var charInterval = v.length > 6 ? Math.floor( intervalTime/ v.length) : 100;
			for(var j = 0; j < v.length; j++) {
				setTimeout(function(ch) {
					var character = ch;
					return function() {
						currentInnerSpan.append(character);
					}
				}(v.charAt(j)), 0 + (charInterval * j));
			}
			// currentInnerSpan.html(v);
		}

		// if end of array add class code-block to currentSpanLine
		if(i == a.length - 1) {
			// setTimeout(addBlockToCurrentSpanLine, intervalTime);
			// currentSpanLine.addClass("code-block");
			// setTimeout(codeContainerChildrenFade, 500);

		}
	} 
	

	// iterates through the array and parse's each array value
	function iterateArr(arr) {

		arrItemTimeoutIds = [];
		var currTimeoutId = 0;

		arr.forEach(function(v, i, a) {
			currTimeoutId = setTimeout(function(value, index, arr) {
				return function() {
					parseArrayItems(value, index, arr)
				}
			}(v, i, a), (i * intervalTime));
			arrItemTimeoutIds.push(currTimeoutId);
		});
		console.log(arrItemTimeoutIds);
	}

	// global variable to store the last delay time so that
	// tDelay will be correct (subtract last delay time from tDelay)
	// since tDelay adds it twice 
	var lastDelay = 0;
	var firstTime = true;

	var arrTimeoutId = 0;

	// will delay the running of the iterateArr function
	function delayArrIteration(arr, delay) {
		// need to add time after first time run to allow for fadeaway on next array iteration
		var delay = firstTime ? delay : delay + 6000
		firstTime = false;
		arrTimeoutId = setTimeout(iterateArr, delay, arr);
		// setTimeout(codeContainerChildrenFade, delay + 500);
		var addToDelay = (arr.length - 1) * intervalTime;
		var delayTime = delay + addToDelay;
		lastDelay = addToDelay;
		return delayTime;
	}

	function codeContainerChildrenFade() {
		codeContainerNode.children().fadeOut(1500, function() {
			// codeContainerNode.html(txtCursorNode)
		});
		setTimeout(function() {
			return function() {
				codeContainerNode.html(txtCursorNode);
			}
		}(), 1500)
	}

	// will iterate through the global codeObj JSON object
	// and when done, run itself again after a delay
	function iterateCodeObj() {
		var lastFadeId;
		var tDelay = 0;
		for(key in codeObj) {
			tDelay += delayArrIteration(codeObj[key], tDelay);
			var fadeDelay = tDelay + 4000;
			lastFadeId = setTimeout(codeContainerChildrenFade, fadeDelay);
			fadingTimeoutIds.push(lastFadeId);
		}

		clearTimeout(lastFadeId);
		lastFadeId = setTimeout(codeContainerChildrenFade, tDelay - lastDelay + 4000);
		fadingTimeoutIds.push(lastFadeId);
		iterateCodeObjTimeoutId = setTimeout(iterateCodeObj, tDelay - lastDelay + 6000);
		firstTime = true;
	}


	window.onfocus = startConsoleAnimation;
	window.onblur = clearCoverContainerStopAnimation;
	startConsoleAnimation();


}); // end of document.ready





























