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
var displayingAll=true
$(document).ready(function() {
    table = $('#datatable').DataTable({
        scrollY:        '70vh',
        scrollX: "60vh",
        scrollCollapse: true,
        paging: false,
        order: [[ 2, "desc" ]],
        destroy: true,
        info: false,
        autoWidth: false,
        //stripe: false,
        "ajax": "data/final.txt",
        "columns": [
            {"data": "Order Number"},
            {"data": "Q Number"},
            {"data": "Date"},
            {"data": "Vehicle"},
            {"data": "Customer Name"},
            {"data": "Delivery Address"},
            {"data": "Status"},
            {"data": "More Info"},
            {"data": "ETA"},
            {"data": "Confirm Order"},
            {"data": "Registration"},
            {"data": "Chassis"},
            {"data": "Actual Delivery Date"},
            {"data": "Date of Registration"},
            {"data": "AFRL"},
            {"data": "Invoice"},
            {"data": "Delivery note"},
            {"data": "Payment Received"}

        ],
        "columnDefs": [
            {
                "targets": [],
                "visible": false,
                "searchable": false
            }
        ]
    });
    //this function allows the user to click a row within the all orders tab and it will take the user to the tab which the order is in and only display that order
    //this means that they can easily make the changes
    $('#datatable tbody').on('click', 'tr', function () {
        if(displayingAll==true){
            var rowData = table.row( this ).data();
            var tabNum
            if (rowData['Status']=="new"){
                tabNum=1
            }
            else if (rowData['Status']=="awaiting reg"){
                tabNum=2
            }
            else if (rowData['Status']=="delivery date requested"){
                tabNum=3
            }
            else if (rowData['Status']=="awaiting global confirmation"){
                tabNum=4
            }
            else if (rowData['Status']=="confirmed delivery"){
                tabNum=5
            }
            else if (rowData['Status']=="awaiting payment"){
                tabNum=6
            }
            else if (rowData['Status']=="completed"){
                tabNum=7
            }
            changeTable(rowData['Status'],tabNum)
            table.columns(1).search(rowData['Q Number']).draw()
            table.columns(1).search('')
        }
        
    } );
} );



function changeTable(whichTable, tabNum){
    var elements = document.getElementsByClassName('tab'); // get all elements
	for(var i = 0; i < elements.length; i++){
        elements[i].style.backgroundColor = "white";
        elements[i].style.color ="black"
    }
    elements[tabNum].style.backgroundColor = "rgb(0, 43, 104)"
    elements[tabNum].style.color = "white"
    table.columns().visible( true )
    table.columns(6).search('').draw()
    if (whichTable=="all"){
        table.columns(6).search('').draw()
        displayingAll=true
    }
    else{
        table.columns(6).search(whichTable).draw()
        displayingAll=false
    }
    
    if (whichTable == "new"){
        table.columns([6,10,11,12,13,14,15,16,17]).visible( false )
        
        
    }
    else if (whichTable == "awaiting reg"){
        table.columns([6,8,9,12,13,14,15,16,17]).visible( false )
    }
    else if (whichTable =="delivery date requested"){
        table.columns([8,9,11,13,14,15,16,17]).visible( false )
    }
    else if (whichTable =="awaiting global confirmation"){
        table.columns([6,8,9,11,12,13,14,15,16,17]).visible( false )
    }
    else if (whichTable =="confirmed delivery"){
        table.columns([6,8,9,11,12,17]).visible( false )
    }
    else if(whichTable =="awaiting payment"){
        table.columns([6,8,9,11,12,13,14,15,16]).visible( false )
    }
    else if(whichTable=="completed"){
        table.columns([6,8,9,11,12,13,14,15,16,17]).visible( false )
    }
}

/*
//this function is called when a tab is clicked, it will firstly hange the colour of the selected tab to show that 
//it is selected, then create the table with the new data from the server
function show(file, tabNum){
    hidePopup()
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
function showPopup(rowData){
    $('#table-container').hide()
    $('#popup-title').html("Order: "+rowData[0]+" - "+rowData[1]+" - "+rowData[2])
    $('#popup').show()
}
function hidePopup(){
    $('#popup').hide()
    $('#table-container').show()
}*/