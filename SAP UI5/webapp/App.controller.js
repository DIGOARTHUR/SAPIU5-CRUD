sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",

], function (Controller, MessageToast, JSONModel) {
    "use strict";
    
    return Controller.extend("Quickstart.App", {
        
        onInit: function () {
            //set the data model onde the view
            this.count=0;
           

        },
        
        onPress: function () {
            alert('Ola mundo')

        },
        handleButtonPress:function(){
           
            this.count++;
            this.getView().byId("idMyInput").setValue(this.count);
        },
        handleNavBack: function(oEvent){
            alert('Ola')
        },


        

    });



});