var DataArray = [];
var Rendered = 0;

$(function(){

    $("#dropBox").click(function(){
        $("#fileInput").click();
    });
    

    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    $(".active").click(function(){
        DisplayData(DataArray);
    });
    


    $('input[type=file]').on('change', fileUpload);
});
function DisplayData(arr){
	if(Rendered < arr.length){
	var Iterations = Rendered;
			for(var i = Rendered ; i <= Rendered+9 ; i++){
		       $('.divTableBody').append(DataArray[i]);
		       Iterations++;
			}
	Rendered = Iterations;
	setTimeout(function(){ $('.active').attr('href','#'+Iterations); }, 1000);
	}
}
function fileUpload(event){

    $("#dropBox").html(event.target.value+" uploading...");
    

    files = event.target.files;
    

    var data = new FormData();                                   


    for (var i = 0; i < files.length; i++) {
        var file = files[i];
		if(file.name.substr(file.name.lastIndexOf('.') +1)  != 'xlsx') {
		    $("#dropBox").html("Please choose an xlsx file.");
		}else{

            data.append('file', file, file.name);
            

            var xhr = new XMLHttpRequest();     
            

            xhr.open('POST', 'upload_and_parse.php', true);  
            xhr.send(data);
            xhr.onload = function () {

                var response = JSON.parse(xhr.responseText);
                var rawRow  = "";
                    DataArray = [];
                    $('.divTableBody').html();
                if(xhr.status === 200 && response.status == 'ok'){
                	$("#dropBox").html("File has been uploaded successfully. Click to upload another.").css('height','10%').css('position','relative');
                	$('.darkTable').css('display','block');
		                for ( var i = 1 ; i <= response.body.length-1 ; i++){
                           var rawRow = JSON.stringify(response.body[i]).split(',"');
		                   var rowsStruct = '<div class="divTableRow hoverable">'  +
                                     '<div class="divTableCell">'+i+'<div class="divTableHead mobile" id="'+i+'">OfferId</div>'+rawRow[0].replace('[','')+'</div>' + 
                                     '<div class="divTableCell"><div class="divTableHead mobile">Offer Name</div>'+rawRow[1].replace('"','')+'</div>' +
                                     '<div class="divTableCell"><div class="divTableHead mobile">Departure Date</div>'+rawRow[2].replace('"','')+'</div>' +
                                     '<div class="divTableCell"><div class="divTableHead mobile">Itinerary</div>'+rawRow[3].replace('"','')+'</div>' +
                                     '<div class="divTableCell"><div class="divTableHead mobile">Cruise Line Name</div>'+rawRow[4].replace('"','')+'</div>' +
                                     '<div class="divTableCell"><div class="divTableHead mobile">Cruise Line Logo</div><img src="images/'+rawRow[5].replace('"','')+'"></div>' +
                                     '<div class="divTableCell"><div class="divTableHead mobile">Cruise Ship Name</div>'+rawRow[6].replace('"','').replace(']','')+'</div></div>';


                             
                             DataArray.push(rowsStruct);
		                }
                 DisplayData(DataArray);
                    
                    

                }else if(response.status == 'type_err'){
                    $("#dropBox").html("Please choose an xlsx file. Click to upload another.");
                }else{
                    $("#dropBox").html("Some problem occured, please try again.");
                }
            };
        }
    }
}