//on hover of the account button, the info box is shown
var infoShown = false
function displayInfo(){
    if (infoShown==false){
        document.getElementById("account-info").style.display="block"
        infoShown =true
    }
    else{
        document.getElementById("account-info").style.display="none"
        infoShown = false
    }
}

var table
$(document).ready(function() {
    //fillTable("all",0)
    table = initDT()
    $('#datatable tbody').on('click', 'tr', function () {
        var rowData = table.row( this ).data();
        alert( 'You clicked on '+rowData[1]+'\'s row' );
    } );
    
} );
function initDT(){
    var table1=$('#datatable').DataTable({
        scrollY:        '70vh',
        scrollX: "60vh",
        scrollCollapse: true,
        paging: false,
        order: [[ 2, "desc" ]],
        destroy: true,
        info: false,
        autoWidth: false,
        "ajax": "data/all.txt",
        "columnDefs": [
            {
                "targets": [3,4,5,6,7,8,9,10,12,13,14,15,16,18,19,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,41],
                "visible": false,
                "searchable": false
            }
        ]
    });
    return table1
}

//this function is called when a tab is clicked, it will firstly hange the colour of the selected tab to show that 
//it is selected, then create the table with the new data from the server
function show(file, tabNum){
    var elements = document.getElementsByClassName('tab'); // get all elements
	for(var i = 0; i < elements.length; i++){
        elements[i].style.backgroundColor = "white";
        elements[i].style.color ="black"
    }
    elements[tabNum].style.backgroundColor = "rgb(0, 43, 104)"
    elements[tabNum].style.color = "white"
    table.destroy()
    table.clear()
    table=$('#datatable').DataTable({
        scrollY:        '70vh',
        scrollX: "60vh",
        scrollCollapse: true,
        paging: false,
        order: [[ 2, "desc" ]],
        destroy: true,
        info: false,
        autoWidth: false,
        "ajax": "data/"+file+".txt",
        "columnDefs": [
            {
                "targets": [3,4,5,6,7,8,9,10,12,13,14,15,16,18,19,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,41],
                "visible": false,
                "searchable": false
            }
        ]
    });
    if(file=="new" ||file=="awaiting-reg"){
        table.columns( [28] ).visible( false );
    }
}



/*

function fillTable(status, tabNum){
    var elements = document.getElementsByClassName('tab'); // get all elements
	for(var i = 0; i < elements.length; i++){
        elements[i].style.backgroundColor = "white";
        elements[i].style.color ="black"
    }
    elements[tabNum].style.backgroundColor = "rgb(0, 43, 104)"
    elements[tabNum].style.color = "white"

    $('#datatable').DataTable().destroy();
    $("#datatable tbody").empty()
    $('.hideReg').remove()
    for (var i=0;i<data.length;i++){
        if (data[i].status==status || status=="all"){
            $('#datatable').append("<tr><td>"+data[i].orderNum+"</td><td>"+data[i].qNum+"</td><td>"+data[i].vehicle+"</td><td>"+data[i].date+"</td><td>"+data[i].customerName+"</td><td class='hideReg'>"+data[i].regNum+"</td></tr>");
            
        }
    }
    if (status=="new" || status=="awaiting reg"){
        $('.hideReg').remove()
        
    }
    else{
        $('#datatable thead tr').append("<th class='hideReg'>Reg</th>")
        
    }
    initDT()
    //table.columns.adjust().draw();
}
*/
