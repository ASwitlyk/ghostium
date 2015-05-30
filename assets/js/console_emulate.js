$(document).ready(function() {

	var codeObj = {

		python: [
		// one line
			'<span class="code-line"></span>',
			'<span class="code-var"></span>',
			'class ',
			'<span class="code-white"></span>',
			'Engineer():',
		// two lines
			'<span class="code-line"></span>',
			'<span class="code-tab"></span>',
			'<span class="code-var"></span>',
			'def __init__',
			'<span class="code-white"></span>',
			'(',
			'<span class="code-arg"></span>',
			'self',
			'<span class="code-white"></span>',
			', *',
			'<span class="code-arg"></span>',
			'args',
			'<span class="code-white"></span>',
			'):'
		],

		'javascript': [
			'<span class="code-line"></span>',
			'<span class="code-var"></span>',
			'class ',
			'<span class="code-white"></span>',
			'Engin',
			'eer():',
		]
	};


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

	// get text cursor
	var txtcursor = $('#txtcursor');
	// make cursor blink


	function makeCursorBlink() {

	}

	var intervalId = setInterval(function(tc) {
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
	}(txtcursor), 500);

	// forEach flags
	var currentSpanLine = false,
		currentInnerSpan,
		codeContainerNode = $('.code-container'),
		txtCursorNode = $('#txtcursor');

	var intervalTime = 500;

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

		arr.forEach(function(v, i, a) {
			setTimeout(function(value, index, arr) {
				return function() {
					parseArrayItems(value, index, arr)
				}
			}(v, i, a), 500 + (i * intervalTime));
		});
	}

	// global variable to store the last delay time so that
	// tDelay will be correct (subtract last delay time from tDelay)
	// since tDelay adds it twice 
	var lastDelay = 0;
	var firstTime = true;

	// will delay the running of the iterateArr function
	function delayArrIteration(arr, delay) {
		// need to add time after first time run to allow for fadeaway on next array iteration
		var delay = firstTime ? delay : delay + 6000
		firstTime = false;
		setTimeout(iterateArr, delay, arr);
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
		var timeoutId;
		var tDelay = 0;
		for(key in codeObj) {
			tDelay += delayArrIteration(codeObj[key], tDelay);
			var fadeDelay = tDelay + 4000;
			timeoutId = setTimeout(codeContainerChildrenFade, fadeDelay);
		}
		// setTimeout(codeContainerChildrenFade, tDelay - (lastDelay + 2000));
		// setTimeout(iterateCodeObj, tDelay - lastDelay + 2500);
		clearTimeout(timeoutId);
		setTimeout(codeContainerChildrenFade, tDelay - lastDelay - 1000);
		setTimeout(iterateCodeObj, tDelay - lastDelay + 1000);
		firstTime = true;
	}

	// iterate the code Object
	setTimeout(iterateCodeObj, 10);

}); // end of document.ready





























