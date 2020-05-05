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
    preferedDeliveryDate: "Prefered Delivery Date",
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
            {"data": dataNames['preferedDeliveryDate']},
            {"data": dataNames['deliveryDate']},
            {"data": dataNames['dateOfRegistration']},
            {"data": dataNames['afrl']},
            {"data": dataNames['invoice']},
            {"data": dataNames['deliveryNote']},
            {"data": dataNames['paymentRecieved']},
            {"data": dataNames['moreInfo']}

        ],
        "columnDefs": [
            {targets: 0, name:'orderNum'},
            {targets: 1, name:'qNum'},
            {targets: 2, name:'orderDate'},
            {targets: 3, name:'vehicle'},
            {targets: 4, name:'customerName'},
            {targets: 5, name:'deliveryAddress'},
            {targets: 6, name:'status'},
            {targets: 7, name:'eta'},
            {targets: 8, name:'confirmOrder'},
            {targets: 9, name:'regNum'},
            {targets: 10, name:'chassis'},
            {targets: 11, name:'preferedDeliveryDate'},
            {targets: 12, name:'deliveryDate'},
            {targets: 13, name:'dateOfRegistration'},
            {targets: 14, name:'afrl'},
            {targets: 15, name:'invoice'},
            {targets: 16, name:'deliveryNote'},
            {targets: 17, name:'paymentRecieved'},
            {targets: 18, name:'moreInfo'}
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

//  ***  This function controls the tabs and which columns should be displayed when a tab is clicked
var lastTab="new"
var lastTabNum=1
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
    table.columns([6,7,8,9,10,11,12,13,14,15,16,17]).visible(false)
    if (whichTab == "new"){
        table.columns(['eta:name','confirmOrder:name']).visible( true )
    }
    else if (whichTab == "awaiting reg"){
        table.columns(['regNum:name','chassis:name']).visible( true )
    }
    else if (whichTab =="global holding"){
        table.columns(['regNum:name']).visible( true )
    }
    else if (whichTab =="delivery date requested"){
        table.columns(['regNum:name','preferedDeliveryDate:name','deliveryDate:name']).visible( true )
    }
    else if (whichTab =="awaiting global confirmation"){
        table.columns(['regNum:name']).visible( true )
    }
    else if (whichTab =="confirmed delivery"){
        table.columns(['regNum:name','dateOfRegistration:name','afrl:name','invoice:name','deliveryNote:name']).visible( true )
    }
    else if(whichTab =="awaiting payment"){
        table.columns(['regNum:name','awaitingPayment:name']).visible( true )
    }
    else if(whichTab=="completed"){
        table.columns(['regNum:name']).visible( true )
    }
    else{
        table.columns(['regNum:name','status:name']).visible(true)
    }
    lastTab = whichTab
    lastTabNum = tabNum
}

//   ***  This function is called whenever there is an upload to the server. It will clear the table and re create it with up to date information from the server
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
            {"data": dataNames['preferedDeliveryDate']},
            {"data": dataNames['deliveryDate']},
            {"data": dataNames['dateOfRegistration']},
            {"data": dataNames['afrl']},
            {"data": dataNames['invoice']},
            {"data": dataNames['deliveryNote']},
            {"data": dataNames['paymentRecieved']},
            {"data": dataNames['moreInfo']}

        ],
        "columnDefs": [
            {targets: 0, name:'orderNum'},
            {targets: 1, name:'qNum'},
            {targets: 2, name:'orderDate'},
            {targets: 3, name:'vehicle'},
            {targets: 4, name:'customerName'},
            {targets: 5, name:'deliveryAddress'},
            {targets: 6, name:'status'},
            {targets: 7, name:'eta'},
            {targets: 8, name:'confirmOrder'},
            {targets: 9, name:'regNum'},
            {targets: 10, name:'chassis'},
            {targets: 11, name:'preferedDeliveryDate'},
            {targets: 12, name:'deliveryDate'},
            {targets: 13, name:'dateOfRegistration'},
            {targets: 14, name:'afrl'},
            {targets: 15, name:'invoice'},
            {targets: 16, name:'deliveryNote'},
            {targets: 17, name:'paymentRecieved'},
            {targets: 18, name:'moreInfo'}
        ],
        "initComplete": function(settings, json){
            editableCells() //calls this function once table has finished initializing
            changeTable(lastTab,lastTabNum)
        }
        
    });
}

//   ***   This function goes through each row in the table and changes the HTML of the cells
//         Only the necessary inputs for the order are added to the rows. e.g. if the status of the row is 'new', then only the eta and confirm order cells become editable
function editableCells(){
    var numOrdersInNew=0
    var numOrdersInAR=0
    var numOrdersInGH=0
    var numOrdersInDDR=0
    var numOrdersInAGC=0
    var numOrdersInCD=0
    var numOrdersInAP=0
    var numOrdersInCompleted=0
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
        var rowOrderForm = rowData[dataNames['moreInfo']]

        var todayDate = new Date()
        var orderDateSplit = rowData[dataNames['orderDate']].split("/") //as it cannot convert dd/mm/yyyy to a date
        var orderDate= new Date(orderDateSplit[2],orderDateSplit[1]-1,orderDateSplit[0])
        var dateDifference =(todayDate-orderDate)/(1000*3600*24) //how old the order is in days

        table.cell(rowIdx,18).data("<button onclick='displayOrderForm(\""+qNum+"\",\""+rowOrderForm+"\")'>Order Form</button>")
        if(rowData[dataNames['orderNum']]==""){
            table.cell(rowIdx, 0).data("<input placeholder='Enter Order Number' onchange='editOrderNum(\""+qNum +"\",this.value)'></input>")
        }
        if(rowStatus=="new"){
            numOrdersInNew+=1
            if (dateDifference>=1){ //if order is more than one day old
                $('tbody tr').eq(rowLoop).find('td').eq(0).addClass('overdue')
            }
            table.cell(rowIdx, 7).data("<input onblur='changeETA(\""+qNum +"\",this.value)' type='date'></input>")
            table.cell(rowIdx, 8).data("<button onclick='confirmOrder(\""+qNum +"\")'>Confirm</button>")
            //highlight cells red
            $('tbody tr').eq(rowLoop).find('td').eq(7).addClass('incomplete')
        }
        else if (rowStatus == "awaiting reg"){
            numOrdersInAR+=1
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
        else if(rowStatus=="global holding"){
            numOrdersInGH+=1
        }
        else if (rowStatus=="delivery date requested"){
            numOrdersInDDR+=1
            table.cell(rowIdx, 12).data("<input onblur='addADD(\""+qNum +"\",this.value)' type='date'></input><button onclick='confirmADD(\""+qNum+"\")'>Ok</button>")
            $('tbody tr').eq(rowLoop).find('td').eq(12).addClass('incomplete')
        }
        else if (rowStatus=="awaiting global confirmation"){
            numOrdersInAGC+=1
        }
        else if (rowStatus=="confirmed delivery"){
            numOrdersInCD+=1
            if(rowDoR==""){
                table.cell(rowIdx, 13).data("<input onblur='addDoR(\""+qNum +"\",this.value)' type='date'></input><button onclick='confirmDoR(\""+qNum+"\")'>Ok</button>")
                $('tbody tr').eq(rowLoop).find('td').eq(13).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(13).addClass('complete')
            }
            if(rowAFRL==""){
                table.cell(rowIdx, 14).data("<input type='file' onchange='uploadAFRL(\""+qNum+"\",event)'></input>")
                $('tbody tr').eq(rowLoop).find('td').eq(14).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(14).addClass('complete')
            }
            if(rowInvoice==""){
                table.cell(rowIdx, 15).data("<input type='file' onchange='uploadInvoice(\""+qNum+"\",event)'></input>")
                $('tbody tr').eq(rowLoop).find('td').eq(15).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(14).addClass('complete')
            }
            if(rowDeliveryNote==""){
                table.cell(rowIdx, 16).data("<input type='file' onchange='uploadDN(\""+qNum+"\",event)'</input>")
                $('tbody tr').eq(rowLoop).find('td').eq(16).addClass('incomplete')
            }
            else{
                $('tbody tr').eq(rowLoop).find('td').eq(16).addClass('complete')
            }
            
        }
        else if(rowStatus=="awaiting payment"){
            numOrdersInAP+=1
            table.cell(rowIdx, 17).data("<input type='checkbox' onclick='paymentRecieved(\""+qNum+"\")'></input>")
        }
        else if (rowStatus=="completed"){
            numOrdersInCompleted+=1
        }
    })
    $('#tabNum0').text(numOrdersInNew+numOrdersInAR+numOrdersInGH+numOrdersInDDR+numOrdersInAGC+numOrdersInCD+numOrdersInAP+numOrdersInCompleted)
    $('#tabNum1').text(numOrdersInNew)
    $('#tabNum2').text(numOrdersInAR)
    $('#tabNum3').text(numOrdersInGH)
    $('#tabNum4').text(numOrdersInDDR)
    $('#tabNum5').text(numOrdersInAGC)
    $('#tabNum6').text(numOrdersInCD)
    $('#tabNum7').text(numOrdersInAP)
    $('#tabNum8').text(numOrdersInCompleted)
}

//when an eta, actual delivery date or date of registration is changed, it will be stored in an associative array so when order is confirmed or ok button is clicked, it can easily be found in the function to validate it.
var etaArray=[]
function changeETA(qNum, date){
    etaArray[qNum]=date
}
var ADDArray=[]
function addADD(qNum, date){
    ADDArray[qNum]=date
}
var DoRArray =[]
function addDoR(qNum, date){
    DoRArray[qNum]=date
}

//  ***  Code to validate inputs and send them to the server   ***

function editOrderNum(qNum, thierNum){
    alert("Order Number of order: "+qNum+", has been set to: "+thierNum)
    //enter code for uploading the order number to the database of this order
    refreshTable()
}

//onclick of the confirm order button, it will check if an eta for that order has been entered
function confirmOrder(qNum){
    var eta=new Date(etaArray[qNum])
    if(eta =="Invalid Date"){
        alert ("Please enter valid date")
    }
    else{
        alert("Order: "+qNum+" has been confirmed with an ETA of: "+eta)
        //enter code for uploading the ETA and confirmation of order to the database of this order
        refreshTable()
    }
   
}
function changeReg(qNum, reg){
    alert("Order: "+qNum+" registration set to: "+reg)
    //enter code for uploading the registration number to the database of this order
    refreshTable()
}
function changeChassis(qNum, chassis){
    alert("Order: "+qNum+" chasisis set to: "+chassis)
    //enter code for uploading the chassis number to the database of this order
    refreshTable()
}

function confirmADD(qNum){
    var ADD=new Date(ADDArray[qNum])
    if(ADD =="Invalid Date"){
        alert ("Please enter valid date")
    }
    else{
        alert("Order: "+qNum+" actual delivery date set to: "+ADD)
        //enter code for uploading the actual delivery date to the database of this order
        refreshTable()
    }
}

function confirmDoR(qNum){
    var DoR=new Date(DoRArray[qNum])
    if(DoR =="Invalid Date"){
        alert ("Please enter valid date")
    }
    else{
        //enter validation of the date of registration
        alert("Order: "+qNum+" date of registration set to: "+DoR)
        //enter code to upload date of registration to database for this order
        refreshTable()
    }
}
function uploadAFRL(qNum, evt){
    var files = evt.target.files
    var afrl = files[0]
    alert(afrl.name+" AFRL uploaded for order "+qNum)
    //enter code for uploading AFRL to database for this order
    refreshTable()
}
function uploadInvoice(qNum, evt){
    var files = evt.target.files
    var invoice = files[0]
    alert(invoice.name+" invoice uploaded for order "+qNum)
    //enter code for uploading invoice to database for this order
    refreshTable()
}
function uploadDN(qNum, evt){
    var files = evt.target.files
    var deliveryNote = files[0]
    alert(deliveryNote.name+" delivery note uploaded for order "+qNum)
    //enter code for uploading delivery note to database for this order
    refreshTable()
}

function paymentRecieved(qNum){
    alert("Payment recieved for order: "+qNum)
    //enter code for making payment recieved on database true for this order
    refreshTable()
}

function displayOrderForm(qNum, orderForm){
    //enter code for displaying the order form. orderForm could be a link to the form 
    alert("Displaying order form for order: "+qNum)
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