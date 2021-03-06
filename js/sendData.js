$(document).ready(function(){

	// global vars
	var sendData = $('.sendData');
	var baseURL = 'https://api.myjson.com/';
	var path = 'bins/';
	var id = '3jdq2';
	var writeData = $('#csv');
	var inputData = $('#json');

	// read local file data from csv
	readDataIntoInput = function(){
		var file = 'data/tournament.csv';
		$.ajax({
			type: 'GET',
			url: file,
			success:function(data){
				writeData.val(data); 
			},
			error:function(textStatus){
				console.log("Error", textStatus);
			}
		})
	}();
	
	var wrapper = $('#tournamentData');
		
	// push the json data to the api
	sendData.on('click',function(){
		var data = inputData.val();
		wrapper.empty();
		$.ajax({
			type: 'PUT',
			dataType: 'json',
			data: data,
			contentType: "application/json; charset=utf-8",
			url: baseURL + path + id,
			success: function(data, textStatus, jqXHR){
				$.each(data, function(i, obj){
                    wrapper.append('<li><span>' +obj.Position+ '</span><span class="wide">' +obj.Teams+ '</span><span>' +obj.Played+ '</span><span>' +obj.Won+ '</span><span>' +obj.Lost+ '</span><span>' +obj["Score Difference"]+ '</span><span>' +obj.Points+ '</span></li>');
                });
			},
			error:function(){
			  console.log('Error');
			}
		});
		return false;
	});

	// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.

	function CSVToArray(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		// Standard fields.
		"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {
		    // Get the delimiter that was found.
		    var strMatchedDelimiter = arrMatches[1];
		    // Check to see if the given delimiter has a length
		    // (is not the start of string) and if it matches
		    // field delimiter. If id does not, then we know
		    // that this delimiter is a row delimiter.
		    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
		        // Since we have reached a new row of data,
		        // add an empty row to our data array.
		        arrData.push([]);
		    }
		    // Now that we have our delimiter out of the way,
		    // let's check to see which kind of value we
		    // captured (quoted or unquoted).
		    if (arrMatches[2]) {
		        // We found a quoted value. When we capture
		        // this value, unescape any double quotes.
		        var strMatchedValue = arrMatches[2].replace(
		        new RegExp("\"\"", "g"), "\"");
		    } else {
		        // We found a non-quoted value.
		        var strMatchedValue = arrMatches[3];
		    }
		    // Now that we have our value string, let's add
		    // it to the data array.
		    arrData[arrData.length - 1].push(strMatchedValue);
		}
		// Return the parsed data.
		return (arrData);
	}

	function CSV2JSON(csv) {
		var array = CSVToArray(csv);
		var objArray = [];
		for (var i = 1; i < array.length; i++) {
		    objArray[i - 1] = {};
		    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
		        var key = array[0][k];
		        objArray[i - 1][key] = array[i][k]
		    }
		}

		var json = JSON.stringify(objArray);
		var str = json.replace(/},/g, "},\r\n");
		return str;
	}

	// convert csv to json
	$("#convert").click(function() {
		var csv = $("#csv").val();
		var json = CSV2JSON(csv);
		$("#json").val(json);
		chValue();
		return false;
	});

	// download json
	$("#download").click(function() {
		var csv = $("#csv").val();
		var json = CSV2JSON(csv);
		window.open("data:text/json;charset=utf-8," + escape(json));
		return false;
	});

	// check we have some input before we can send the data
	chValue = function(){
		if(inputData.val().length > 0){
			sendData.removeClass('disabled');
		}else{
			sendData.addClass('disabled');
		}
	}

	inputData.on('blur',function(){
		chValue();
	});

});