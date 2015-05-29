$(document).ready(function() {

	var codeObj = {

		python: [
		// one line
			'<span class="code-line"></span>',
			'<span class="code-var"></span>',
			'class &nbsp',
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
			',&nbsp;*',
			'<span class="code-arg"></span>',
			'args',
			'<span class="code-white"></span>',
			'):'
		],

		javascript: [


		]

	}

	// accepts an array of strings
	function processLangArr() {

	}

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

	function appendHTMLtoEl(el) {

	}

	function insertHTMLintoEl(el) {

	}


	// get text cursor
	var txtcursor = $('#txtcursor');
	// make cursor blink
	var intervalId = setInterval(function(tc) {
		var hidden = false;
		return function() {
			console.log()
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

	// Parse items in array


	function parseArrayItems(v, i, a) {

		if(checkForSpan(v)) {
					// is value a span class="code-line"
					if(checkSpanForClassLine(v)) {
						// if not first currentSpanLine, set add block class to current Span Line before reassigning
						if(currentSpanLine) {
							currentSpanLine.addClass("code-block");
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
					currentInnerSpan.html(v);
				}

				// if end of array add class code-block to currentSpanLine
				if(i == a.length - 1) {
					currentSpanLine.addClass("code-block");
				}
	}

	function testIt() {

		codeObj.python.forEach(function(v, i, a) {

			// setTimeout will call a function for each iteration
			// with it's own closure
			setTimeout(function(value, index, arr) {
				return function() {
					parseArrayItems(value, index, arr);
				}
			}(v, i, a), 500 + (i * 500));

		});
	} // end of testIt

	// test it out after three seconds
	setTimeout(testIt, 3000);

}); // end of document.ready





























