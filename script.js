// ==UserScript==
// @name         Town Star Multiple Item Auto-Sell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jiro  -Modify from exisiting scripts from  Groove
// @match        *://*.sandbox-games.com/*
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const sellTimer = 30; // Seconds between selling
    var craftedItem = [{name:"Pinot_Noir_Grapes",count:10},
                        {name:"Wheat",count:20},
                        {name:"Flour",count:10},
                        {name:"Gasoline",count:40},
                        {name:"Silica",count:10},
                        {name:"Wood",count:33},
                        {name:"Petroleum",count:11},
                        {name:"Wool",count:10},
                        {name:"Wool_Yarn",count:10}];
    let sellingActive = 0;
    var depotTimer = [];
    var strData = "";
    var strSellingData = "";
    new MutationObserver(function(mutations){
        let airdropcollected = 0;
        if(document.getElementsByClassName('hud-jimmy-button')[0] && document.getElementsByClassName('hud-jimmy-button')[0].style.display != 'none'){
            document.getElementsByClassName('hud-jimmy-button')[0].click();
            document.getElementById('Deliver-Request').getElementsByClassName('yes')[0].click();
        }
        if(document.getElementsByClassName('hud-airdrop-button')[0] && document.getElementsByClassName('hud-airdrop-button')[0].style.display != 'none'){
            if(airdropcollected == 0){
                airdropcollected = 1;
                document.getElementsByClassName('hud-airdrop-button')[0].click();
                document.getElementsByClassName('air-drop')[0].getElementsByClassName('yes')[0].click();
            }
        }
        if (document.getElementById("playnow-container") && document.getElementById("playnow-container").style.visibility !== "hidden") {
            document.getElementById("playButton").click();
        }




        if(typeof Game != 'undefined' && Game.town != null) {
            if(sellingActive == 0) {
                console.log('Game loaded');
                setTimeout(function(){
                    if (document.getElementsByClassName('mayhem-logo').length>0) {
                        document.getElementsByClassName('close-button')[21].click();
                    }
                },2000);

              sellingActive = 1;
              activateSelling();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});

    
    function addToList(){
        var itemListArray = JSON.parse(document.getElementById("configTxt").value);
        if(itemListArray.findIndex(e => e.name === document.getElementById("ListOfAllItem").value)>-1){
            itemListArray.splice(itemListArray.findIndex(e => e.name === document.getElementById("ListOfAllItem").value),1);
        }
        var count = Number(document.getElementById("SellingAmount").value);
        var name = document.getElementById("ListOfAllItem").value;
        if(count <10){count =10;}
        itemListArray.push({name:name,count:count});
        document.getElementById("configTxt").value = JSON.stringify(itemListArray);
    }

    function removeFromList(){
        var itemListArray = JSON.parse(document.getElementById("configTxt").value);
         if(itemListArray.findIndex(e => e.name === document.getElementById("ListOfAllItem").value)>-1){
            itemListArray.splice(itemListArray.findIndex(e => e.name === document.getElementById("ListOfAllItem").value),1);
        }
        document.getElementById("configTxt").value = JSON.stringify(itemListArray);
    }


    function LoadConfig(){
        document.getElementById("ConfigDiv").style.visibility = "visible";
        //To close all fullscreens
        for(var i =0;i<document.getElementsByClassName ("close-button").length;i++)
        {
            document.getElementsByClassName ("close-button")[i].click();
        }
    }
    function CloseConfig(){
        document.getElementById("ConfigDiv").style.visibility = "hidden";
        localStorage.setItem("LumberMill",document.getElementById("LumberMillCheckBox").checked);
        localStorage.setItem("WaterFacility",document.getElementById("WaterFacilityCheckBox").checked);
        localStorage.setItem("Refinery",document.getElementById("RefineryCheckBox").checked);
        localStorage.setItem("LaborCost",Number(document.getElementById("LaborCost").value));
        localStorage.setItem("AutoComplete",document.getElementById("AutoCompleteCheckBox").checked);
        localStorage.setItem("StartSelling",document.getElementById("StartSellingCheckBox").checked);
        localStorage.setItem("ClearConsole",document.getElementById("ClearConsoleCheckBox").checked);
        localStorage.setItem("ItemToSell",document.getElementById("configTxt").value);
    }
    function ClearData(){
        localStorage.removeItem("ItemToSell");
    }


    function activateSelling() {
        var listItem = localStorage.getItem("ItemToSell");
        var sLumberMill = localStorage.getItem("LumberMill");
        var sWaterFacility = localStorage.getItem("WaterFacility");
        var sRefinery = localStorage.getItem("Refinery");
        var sLaborCost = localStorage.getItem("LaborCost");
        var sAutoComplete = localStorage.getItem("AutoComplete");
        var sStartSelling = localStorage.getItem("StartSelling");
        var sClearConsole = localStorage.getItem("ClearConsole");

        if(listItem != null){
            craftedItem = JSON.parse(listItem);
        }


        var sellingAmount = document.createElement("Input");
        var addToListBtn = document.createElement("BUTTON");
        var removeListBtn = document.createElement("BUTTON");

        var itemlist = document.createElement("select");
        itemlist.id = "ListOfAllItem";
        for (var item in Game.craftData){
            itemlist.add(new Option(item, item));
        }


        var node = document.createElement("DIV");
        var Loadbtn = document.createElement("BUTTON");
        var node2 = document.createElement("DIV");
        var Savebtn = document.createElement("BUTTON");
        var ClearStorageDataBtn = document.createElement("BUTTON");
        var text = document.createElement("TEXTAREA");
        var lumberMillCheckBox = document.createElement("Input");
        var waterFacilityCheckBox = document.createElement("Input");
        var RefineryCheckBox = document.createElement("Input");
        var AutoCompleteCheckBox = document.createElement("Input");
        var LaborCost = document.createElement("Input");
        var ClearConsoleLogCheckBox = document.createElement("Input");

        var StartSellingCheckBox = document.createElement("Input");
        Loadbtn.setAttribute("style","height: 15px;width:85px");
        Loadbtn.setAttribute("id", "configBtn");
        Loadbtn.textContent = "Open";
        Loadbtn.onclick = LoadConfig;

        Savebtn.setAttribute("style","height:20px;width:100px;");
        Savebtn.setAttribute("id", "Savebtn");
        Savebtn.textContent = "Close config";
        Savebtn.onclick = CloseConfig;

        ClearStorageDataBtn.setAttribute("style","height:20px;width:150px;margin-left:10px;");
        ClearStorageDataBtn.setAttribute("id", "ClearDataBtn");
        ClearStorageDataBtn.textContent = "Clear Storage Data";
        ClearStorageDataBtn.onclick = ClearData;

        text.setAttribute("readonly", "true");
        text.setAttribute("id", "configTxt");
        text.setAttribute("style","height:100px;width:380px;");
        lumberMillCheckBox.type = "checkbox";
        lumberMillCheckBox.style.height = "12px";
        lumberMillCheckBox.setAttribute("id", "LumberMillCheckBox");
        if(sLumberMill != null){
            if(sLumberMill =="false"){
                lumberMillCheckBox.checked = false;
            }else{
                lumberMillCheckBox.checked = true;
            }
        }
        
        waterFacilityCheckBox.type = "checkbox";
        waterFacilityCheckBox.style.height = "12px";
        waterFacilityCheckBox.setAttribute("id", "WaterFacilityCheckBox");
        if(sWaterFacility != null){
            if(sWaterFacility =="false"){
                waterFacilityCheckBox.checked = false;
            }else{
                waterFacilityCheckBox.checked = true;
            }
        }
        
        RefineryCheckBox.type = "checkbox";
        RefineryCheckBox.style.height = "12px";
        RefineryCheckBox.setAttribute("id", "RefineryCheckBox");
        if(sRefinery != null){
            if(sRefinery =="false"){
                RefineryCheckBox.checked = false;
            }else{
                RefineryCheckBox.checked = true;
            }
        }
        
        AutoCompleteCheckBox.type = "checkbox";
        AutoCompleteCheckBox.style.height = "12px";
        AutoCompleteCheckBox.setAttribute("id", "AutoCompleteCheckBox");
        if(sAutoComplete != null){
            if(sAutoComplete =="false"){
                AutoCompleteCheckBox.checked = false;
            }else{
                AutoCompleteCheckBox.checked = true;
            }
        }
        
        
        LaborCost.type = "number";
        LaborCost.style.height = "10px";
        LaborCost.style.width = "50px";
        LaborCost.style.fontSize= "12px";
        LaborCost.style.padding= "4px";
        LaborCost.style.marginLeft= "5px";
        LaborCost.style.borderRadius= "0px";
        LaborCost.style.textAlign= "right";
        LaborCost.setAttribute("id", "LaborCost");
        LaborCost.value = 20;
        if(sLaborCost != null){LaborCost.value = Number(sLaborCost);}


        StartSellingCheckBox.type = "checkbox";
        StartSellingCheckBox.style.height = "12px";
        StartSellingCheckBox.setAttribute("id", "StartSellingCheckBox");
        if(sStartSelling != null){
            if(sStartSelling =="false"){
                StartSellingCheckBox.checked = false;
            }else{
                StartSellingCheckBox.checked = true;
            }
        }

        
        ClearConsoleLogCheckBox.type = "checkbox";
        ClearConsoleLogCheckBox.style.height = "12px";
        ClearConsoleLogCheckBox.setAttribute("id", "ClearConsoleCheckBox");
        ClearConsoleLogCheckBox.checked = true;  
        if(sClearConsole != null){
            if(sClearConsole =="false"){
                ClearConsoleLogCheckBox.checked = false;
            }else{
                ClearConsoleLogCheckBox.checked = true;
            }
        }


        node.appendChild(Loadbtn);
        node2.id ="ConfigDiv";

        sellingAmount.type = "number";
        sellingAmount.style.height = "10px";
        sellingAmount.style.width = "35px";
        sellingAmount.style.fontSize= "12px";
        sellingAmount.style.padding= "4px";
        sellingAmount.style.marginLeft= "5px";
        sellingAmount.style.borderRadius= "0px";
        sellingAmount.style.textAlign= "right";
        sellingAmount.setAttribute("id", "SellingAmount");
        sellingAmount.min=10;
        sellingAmount.value = 10;

        itemlist.style.height = "22px";
        itemlist.style.fontSize = "13px";
        itemlist.style.margin = "5px";

        addToListBtn.style.height = "22px";
        addToListBtn.style.width = "30px";
        addToListBtn.style.marginLeft = "5px";
        addToListBtn.id = "AddBtn";
        addToListBtn.textContent = "Add";
        addToListBtn.onclick = addToList;

        removeListBtn.style.height = "22px";
        removeListBtn.style.width = "50px";
        removeListBtn.style.marginLeft = "5px";
        removeListBtn.id = "RemoveBtn";
        removeListBtn.textContent = "Remove";
        removeListBtn.onclick = removeFromList;

        node2.appendChild(itemlist);


        node2.append("Amount to start selling:");

        node2.appendChild(sellingAmount);
        node2.appendChild(addToListBtn);
        node2.appendChild(removeListBtn);
        node2.appendChild(document.createElement("hr"));



        node2.setAttribute("style", "position: fixed;z-index: 1000;width: 400px;height: 100%;background-color: #edededd6;visibility:hidden");
        node2.appendChild(text);
        node2.appendChild(document.createElement("hr"));
        node2.append("Turn on/off Lumber Mill for Vines/Construction (5 Woods):");
        node2.appendChild(lumberMillCheckBox);
        node2.appendChild(document.createElement("hr"));
        node2.append("Turn on/off Water Facility to Prevent Water Drum Overflow (8 Drums):");
        node2.appendChild(waterFacilityCheckBox);
        node2.appendChild(document.createElement("hr"));
        node2.append("Turn on/off Refinery to Prevent Energy Overflow (5 Energy): ");
        node2.appendChild(RefineryCheckBox);
        node2.appendChild(document.createElement("hr"));
        node2.append("Auto Complete Construction Site");
        node2.appendChild(AutoCompleteCheckBox);
        node2.appendChild(document.createElement("br"));
        node2.append("Labor Cost :");
        node2.appendChild(LaborCost);
        node2.appendChild(document.createElement("hr"));

        node2.append("Start Selling :");
        node2.appendChild(StartSellingCheckBox);
        node2.appendChild(document.createElement("hr"));

        node2.append("Clear console?");
        node2.appendChild(ClearConsoleLogCheckBox);
        node2.appendChild(document.createElement("hr"));
        node2.appendChild(Savebtn);
        node2.appendChild(ClearStorageDataBtn);



        node.appendChild(node2);
        node.setAttribute("style", "position:fixed;z-index:1000");
        text.value =JSON.stringify(craftedItem);
        document.getElementsByTagName("Body")[0].appendChild(node)
    
        let start = GM_getValue("start", Date.now());
        GM_setValue("start", start);
        setTimeout(function(){
            let tempSpawnCon = Trade.prototype.SpawnConnection;
            Trade.prototype.SpawnConnection = function(r) {tempSpawnCon.call(this, r); console.log(r.craftType); GM_setValue(Math.round((Date.now() - start)/1000).toString(), r.craftType);}
        },10000);

        window.mySellTimer = setInterval(function(){
            var depotObjArray = Object.values(Game.town.objectDict).filter(o => o.logicType === 'Trade');
            var waterFacilityArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Water_Facility');
            var powerPlantArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Power_Plant');
            var lumberMillArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Lumber_Mill');
            var VinesArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Pinot_Noir_Vines' ||o.type === 'Cabernet_Vines' ||o.type === 'Chardonnay_Vines');
            var ConstructionSiteArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Construction_Site' );
            var isVinesNeedWood = false;
            var isConstructionNeedWood = false;
            var depotObj = "";
            var busyDepotKey = "";
            var depotKey = "";
            var busyDepot = [];
            var i,j;
            if(ClearConsoleLogCheckBox.checked){
                console.clear();
            }

            if(ConstructionSiteArray.length >0 && AutoCompleteCheckBox.checked){
                for(i = 0;i<ConstructionSiteArray.length;i++){
                    if(ConstructionSiteArray[i].logicObject.data.state == "Complete"){
                        if( Game.objectData[ConstructionSiteArray[i].logicObject.data.type].LaborCost <LaborCost.value){
                                 ConstructionSiteArray[i].logicObject.OnTapped();
                        }
                    }else{

                        if(ConstructionSiteArray[i].logicObject.constructionData.reqs.Wood != undefined){
                            if(ConstructionSiteArray[i].logicObject.data.receivedCrafts.Wood == undefined ||
                              ConstructionSiteArray[i].logicObject.data.receivedCrafts.Wood <ConstructionSiteArray[i].logicObject.constructionData.reqs.Wood ){
                                isConstructionNeedWood = true;
                            }
                        }

                    }
                }
            }


            if(waterFacilityArray.length >0 && waterFacilityCheckBox.checked){
                if (Game.town.GetStoredCrafts()["Water_Drum"] > 8) {
                    for(i = 0;i<waterFacilityArray.length;i++){
                        if(waterFacilityArray[i].logicObject.data.craft == "Water_Drum"){
                            waterFacilityArray[i].logicObject.SetCraft("None");
                        }
                    }
                    console.log("Turning off Water Facility");
                }else{
                    for(i = 0;i<waterFacilityArray.length;i++){
                        if(waterFacilityArray[i].logicObject.data.craft == "None"){
                            waterFacilityArray[i].logicObject.SetCraft("Water_Drum");
                        }
                    }
                    console.log("Turning on Water Facility");
                }
            }

            if(powerPlantArray.length >0 && RefineryCheckBox.checked){
                if (Game.town.GetStoredCrafts()["Energy"] > 5) {
                    for(i = 0;i<powerPlantArray.length;i++){
                        if(powerPlantArray[i].logicObject.data.craft == "Energy"){
                            powerPlantArray[i].logicObject.SetCraft("None");
                        }
                    }
                    console.log("Turning off Power Plant");
                }else{
                    for(i = 0;i<powerPlantArray.length;i++){
                        if(powerPlantArray[i].logicObject.data.craft == "None"){
                            powerPlantArray[i].logicObject.SetCraft("Energy");
                        }
                    }
                    console.log("Turning on Power Plant");
                }
            }

            isVinesNeedWood = false;
            for(j=0;j<VinesArray.length;j++){
                if(VinesArray[j].logicObject.data.state =="WaitForReqs"){
                    isVinesNeedWood = true;
                    break;
                }
            }



            if(lumberMillArray.length >0 && lumberMillCheckBox.checked){
                 if ((Game.town.GetStoredCrafts()["Wood"] < 5 || Game.town.GetStoredCrafts()["Wood"] == undefined)
                     && (isVinesNeedWood|| isConstructionNeedWood)) {
                    for(i = 0;i<lumberMillArray.length;i++){
                        if(lumberMillArray[i].logicObject.data.craft == "Lumber" && lumberMillArray[i].logicObject.data.state != "Produce"){
                            if(lumberMillArray[i].logicObject.data.reqList.Wood>3){
                                lumberMillArray[i].logicObject.SetCraft("None");
                            }
                        }
                    }
                    console.log("Turning off Lumber Mill");
                }else{
                    for(i = 0;i<lumberMillArray.length;i++){
                        if(lumberMillArray[i].logicObject.data.craft == "None"){
                            lumberMillArray[i].logicObject.SetCraft("Lumber");
                        }
                    }
                    console.log("Turning on Lumber Mill");
                }
            }

            if(Game.town.tradesList.length>0){
                for(j =0;j<Game.town.tradesList.length;j++){
                    busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                    var startTime = new Date(Game.town.tradesList[j].startTime);
                    var endTime = new Date(startTime.getTime() + Game.town.tradesList[j].duration);
                    var currentTime = new Date();
                    console.log("Depot Busy -- " + busyDepotKey);
                    if(currentTime.getTime()-endTime.getTime()>1000){
                        busyDepot.push(busyDepotKey);
                        console.log("Depot Busy -- " + busyDepotKey);
                        Game.town.objectDict[busyDepotKey].logicObject.OnTapped();
                    }else{
                        busyDepot.push(busyDepotKey);
                        console.log("Depot Busy -- " + busyDepotKey);
                    }
                }
            }

            if (Game.town.GetStoredCrafts()["Gasoline"] > 0) {
                var itemtoSell;
                var nCountItem;
                var craftedItem =JSON.parse(document.getElementById("configTxt").value)
                strData = "";
                for(i=0;i< craftedItem.length;i++){
                    itemtoSell= craftedItem[i].name;
                    nCountItem= craftedItem[i].count;
                    if (Game.town.GetStoredCrafts()[itemtoSell] != undefined){
                        strData += "current " +itemtoSell + " count: " + Game.town.GetStoredCrafts()[itemtoSell] + "|"+ nCountItem + "\n";
                        if (Game.town.GetStoredCrafts()[itemtoSell] >= nCountItem) {
                            break;
                        }
                    }
                }
                console.log(strData);
                var isFound = false;
                if (Game.town.GetStoredCrafts()[itemtoSell] >= nCountItem) {
                    if(nCountItem >= 100){
                        for(var k =0;k<depotObjArray.length;k++){
                            if(depotObjArray[k].type == "Freight_Pier"){
                                depotObj = depotObjArray[k];
                                depotKey = "[" + depotObj.townX+ ", " + "0, " + depotObj.townZ + "]";
                                 if(Game.town.tradesList.length>0){
                                      for(j =0;j<Game.town.tradesList.length;j++){
                                          busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                                          if(depotKey == busyDepotKey){
                                              depotObj = "";
                                          }

                                      }
                                }

                                if(depotObj != ""){
                                    break;
                                }
                            }
                        }
                    }else{
                        for(var l =0;l<depotObjArray.length;l++){
                            if(depotObjArray[l].type != "Freight_Pier"){
                                depotObj = depotObjArray[l];
                                depotKey = "[" + depotObj.townX + ", " + "0, " + depotObj.townZ + "]";
                                if(Game.town.tradesList.length>0){
                                      for(j =0;j<Game.town.tradesList.length;j++){
                                          busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                                          if(depotKey == busyDepotKey){
                                              depotObj = "";
                                          }

                                      }
                                }

                                if(depotObj != ""){
                                    break;
                                }
                            }
                        }
                    }
                  
                    if(depotObj != ""){
                        console.log(strData);
                        if(strSellingData.length>5000){
                            strSellingData = "";
                        }
                       
                        strSellingData += "SELLING " + itemtoSell + "! - " + new Date() + " --> x:" + depotObj.townX + "z:" + depotObj.townZ +  "\n" ;
                        console.log(strSellingData);
                        if(StartSellingCheckBox.checked){
                            Game.app.fire("SellClicked", {x: depotObj.townX, z: depotObj.townZ});
                            setTimeout(function(){
                                let craftTarget = document.getElementById("trade-craft-target");
                                craftTarget.querySelectorAll('[data-name="' + itemtoSell + '"]')[0].click();
                                setTimeout(function(){
                                    document.getElementById("destination-target").getElementsByClassName("destination")[0].getElementsByClassName("sell-button")[0].click();
                                },1000);
                            },3000);
                        }
                    }else{
                        console.log(strSellingData);
                    }
                }else{
                    console.log(strSellingData);
                }
            }else{
                console.log("Run out of gas!!!");
            }
        },sellTimer*1000);
    }
})();
