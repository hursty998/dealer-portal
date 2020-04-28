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



//place name/identifier of each data item here
var dataNames = 
{
    orderNum: "Order Number",
    qNum: "Q Number", 
    orderDate: "Date", 
    vehicle: "Vehicle",
    customerName: "Customer Name",
    deliveryAddress: "Delivery Address",
    status: "Status",
    moreInfo: "More Info",
    eta: "ETA",
    confirmOrder: "Confirm Order",
    regNum: "Registration",
    chassis: "Chassis",
    deliveryDate: "Actual Delivery Date",
    dateOfRegistration: "Date of Registration",
    afrl: "AFRL",
    invoice: "Invoice",
    deliveryNote: "Delivery note",
    paymentRecieved: "Payment Received"

}
var table
var editor
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
            {"data": dataNames['orderNum']},
            {"data": dataNames['qNum']},
            {"data": dataNames['orderDate']},
            {"data": dataNames['vehicle']},
            {"data": dataNames['customerName']},
            {"data": dataNames['deliveryAddress']},
            {"data": dataNames['status']},
            {"data": dataNames['eta']},
            {"data": dataNames['confirmOrder']},
            {"data": dataNames['regNum']},
            {"data": dataNames['chassis']},
            {"data": dataNames['deliveryDate']},
            {"data": dataNames['dateOfRegistration']},
            {"data": dataNames['afrl']},
            {"data": dataNames['invoice']},
            {"data": dataNames['deliveryNote']},
            {"data": dataNames['paymentRecieved']},
            {"data": dataNames['moreInfo']}

        ],
        "columnDefs": [
            {
                "targets": [],
                "visible": false,
                "searchable": false
            }
        ],
        "initComplete": function(settings, json){
            editableCells() //calls this function once table has finished initializing
            changeTable("new",1)
        }
        
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
var lastTab="new"
var lastTabNum=1
function refreshTable(){
    table.destroy()
    table.clear()
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
            {"data": dataNames['orderNum']},
            {"data": dataNames['qNum']},
            {"data": dataNames['orderDate']},
            {"data": dataNames['vehicle']},
            {"data": dataNames['customerName']},
            {"data": dataNames['deliveryAddress']},
            {"data": dataNames['status']},
            {"data": dataNames['eta']},
            {"data": dataNames['confirmOrder']},
            {"data": dataNames['regNum']},
            {"data": dataNames['chassis']},
            {"data": dataNames['deliveryDate']},
            {"data": dataNames['dateOfRegistration']},
            {"data": dataNames['afrl']},
            {"data": dataNames['invoice']},
            {"data": dataNames['deliveryNote']},
            {"data": dataNames['paymentRecieved']},
            {"data": dataNames['moreInfo']}

        ],
        "columnDefs": [
            {
                "targets": [],
                "visible": false,
                "searchable": false
            }
        ],
        "initComplete": function(settings, json){
            editableCells() //calls this function once table has finished initializing
            changeTable(lastTab,lastTabNum)
        }
    })
}

function editableCells(){
    table.rows().every( function(rowIdx, tableLoop, rowLoop){
        var rowData = this.data()
        var qNum =rowData[dataNames['qNum']]
        var rowStatus=rowData[dataNames['status']]
        var rowReg=rowData[dataNames['regNum']]
        var rowChassis=rowData[dataNames['chassis']]
        var rowADD=rowData[dataNames['deliveryDate']]
        var rowDoR=rowData[dataNames['dateOfRegistration']]
        var rowAFRL=rowData[dataNames['afrl']]
        var rowInvoice=rowData[dataNames['invoice']]
        var rowDeliveryNote=rowData[dataNames['deliveryNote']]
        var rowPaymentRecieved=rowData[dataNames['paymentRecieved']]
        if(rowData[dataNames['orderNum']]==""){
            table.cell(rowIdx, 0).data("<input placeholder='Enter Order Number' onchange='editOrderNum(\""+qNum +"\",this.value)'></input>")
        }
        if(rowStatus=="new"){
            table.cell(rowIdx, 7).data("<input onblur='changeETA(\""+qNum +"\",this.value)' type='date'></input>")
            table.cell(rowIdx, 8).data("<button onclick='confirmOrder(\""+qNum +"\")'>Confirm</button>")
            //highlight cells red
            $('tbody tr').eq(rowLoop).find('td').eq(7).addClass('incomplete')
        }
        else if (rowStatus == "awaiting reg"){
            if(rowReg==""){
                table.cell(rowIdx, 9).data("<input placeholder='Enter Registration' pattern='^[A-Za-z]{2}[ ]{0,1}[0-9]{2}[ ]{0,1}[a-zA-Z]{3}$' onchange='changeReg(\""+qNum +"\",this.value)'></input>")
                //highlight cell red
                $('tbody tr').eq(rowLoop).find('td').eq(9).addClass('incomplete')
            }
            else{
                //highlight cell green
                $('tbody tr').eq(rowLoop).find('td').eq(9).addClass('complete')
            }
            
            if(rowChassis==undefined){
                table.cell(rowIdx, 10).data("<input placeholder='Enter Chassis' onchange='changeChassis(\""+qNum +"\",this.value)'></input>")
                //highlight cell red
                $('tbody tr').eq(rowLoop).find('td').eq(10).addClass('incomplete')
                //once both chassis and reg are uploaded, status should change to delivery date requested
            }
            else{
                //highlight cell green
                $('tbody tr').eq(rowLoop).find('td').eq(10).addClass('complete')
            }
        }
        else if (rowStatus=="delivery date requested"){
            table.cell(rowIdx, 11).data("<input onblur='addADD(\""+qNum +"\",this.value)' type='date'></input><button onclick='confirmADD(\""+qNum+"\")'>Ok</button>")
            $('tbody tr').eq(rowLoop).find('td').eq(11).addClass('incomplete')
        }
        else if (rowStatus=="confirmed delivery"){
            if(rowDoR==""){
                table.cell(rowIdx, 12).data("<input onblur='addDoR(\""+qNum +"\",this.value)' type='date'></input><button onclick='confirmDoR(\""+qNum+"\")'>Ok</button>")
                $('tbody tr').eq(rowLoop).find('td').eq(12).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(12).addClass('complete')
            }
            if(rowAFRL==""){
                table.cell(rowIdx, 13).data("<input type='file' >Upload AFRL</input>")
                $('tbody tr').eq(rowLoop).find('td').eq(13).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(13).addClass('complete')
            }
            if(rowInvoice==""){
                table.cell(rowIdx, 14).data("<input type='file' >Upload Invoice</input>")
                $('tbody tr').eq(rowLoop).find('td').eq(14).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(14).addClass('complete')
            }
            if(rowDeliveryNote==""){
                table.cell(rowIdx, 15).data("<input type='file' >Upload Delivery Note</input>")
                $('tbody tr').eq(rowLoop).find('td').eq(15).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(15).addClass('complete')
            }
            
        }
        else if(rowStatus=="awaiting payment"){
            table.cell(rowIdx, 16).data("<input type='checkbox' ></input>")
        }
    })
}

function editOrderNum(qNum, thierNum){
    alert("Order Number of order: "+qNum+", has been set to: "+thierNum)
}
//when an eta is changed, it will be stored in an associative array so when order is confirmed, it can easily be found. I did this because i couldnt find a way to access the ETA from the text box
var etaArray=[]
function changeETA(qNum, date){
    etaArray[qNum]=date
}
//onclick of the confirm order button, it will check if an eta for that order has been entered
function confirmOrder(qNum){
    var eta=etaArray[qNum]
    if(eta==undefined){
        alert("Please enter ETA before confirmation")
    }
    else{
        alert("Order: "+qNum+" has been confirmed with an ETA of: "+eta)
        //send eta and order confirmed to server using qNum
        refreshTable()
    }
}
function changeReg(qNum, reg){
    alert("Order: "+qNum+" registration set to: "+reg)
    refreshTable()
}
function changeChassis(qNum, chassis){
    alert("Order: "+qNum+" chasisis set to: "+chassis)
    refreshTable()
}
var ADDArray=[]
function addADD(qNum, date){
    ADDArray[qNum]=date
}
function confirmADD(qNum){
    var ADD=ADDArray[qNum]
    if(ADD==undefined){
        alert("Please enter actual delivery date before proceding")
    }
    else{
        alert("Order: "+qNum+" actual delivery date set to: "+ADD)
        refreshTable()
    }
}
var DoRArray =[]
function addDoR(qNum, date){
    DoRArray[qNum]=date
}
function confirmDoR(qNum){
    var DoR = DoRArray[qNum]
    if(DoR ==undefined){
        alert("Please enter date of registration before proceding")
    }
    else{
        alert("Order: "+qNum+" date of registration set to: "+DoR)
        refreshTable()
    }
}



function changeTable(whichTab, tabNum){
    var elements = document.getElementsByClassName('tab'); // get all elements
	for(var i = 0; i < elements.length; i++){
        elements[i].style.backgroundColor = "white";
        elements[i].style.color ="black"
    }
    elements[tabNum].style.backgroundColor = "rgb(0, 43, 104)"
    elements[tabNum].style.color = "white"
    table.columns().visible( true )
    table.columns(6).search('').draw()
    table.search('').draw()
    if (whichTab=="all"){
        displayingAll=true
    }
    else{
        table.columns(6).search(whichTab).draw()
        displayingAll=false
    }
    
    if (whichTab == "new"){
        table.columns([6,9,10,11,12,13,14,15,16]).visible( false )
    }
    else if (whichTab == "awaiting reg"){
        table.columns([6,7,8,11,12,13,14,15,16]).visible( false )
    }
    else if (whichTab =="delivery date requested"){
        table.columns([6,7,8,10,12,13,14,15,16]).visible( false )
    }
    else if (whichTab =="awaiting global confirmation"){
        table.columns([6,7,8,10,11,12,13,14,15,16]).visible( false )
    }
    else if (whichTab =="confirmed delivery"){
        table.columns([6,7,8,10,11,16]).visible( false )
    }
    else if(whichTab =="awaiting payment"){
        table.columns([6,7,8,10,11,12,13,14,15]).visible( false )
    }
    else if(whichTab=="completed"){
        table.columns([6,7,8,10,11,12,13,14,15,16]).visible( false )
    }
    else{
        table.columns([7,8,10,11,12,13,14,15,16]).visible( false )
    }
    lastTab = whichTab
    lastTabNum = tabNum
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