sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",

], function (Controller, MessageToast, JSONModel) {
    "use strict";
 
    return Controller.extend("webapp.App", {

        onInit: function () {
          
            this.student ={
                namePerson:"",
                address:"",
                phone:"",

            };

            this.data ={
                students:[],
                student:this.student
            };

        },
        // CAPTURA OS DADOS
        onAfterRendering: function () {
            var oModel = new sap.ui.model.json.JSONModel(this.data);
            this.getView().setModel(oModel); 
        },
      
        handleAddContato: function (oEvent){
            if(!this.newContactDialog){
                this.newContactDialog = sap.ui.xmlfragment("webapp.register",this);
                var oModel = new sap.ui.model.json.JSONModel();
                this.newContactDialog.setModel(oModel); 
            }

            this.newContactDialog.getModel().setData(this.student) 
            this.newContactDialog.open();
           


        },

        handleCancelBtnPress: function(){
            this.newContactDialog.close();
        },
        handleSaveBtnPress:function(oEvent){
             var oModel = oEvent.getSource().getModel();
             var oDialogData = oModel.getData();

             var oViewData = this.getView().getModel.getData();
             oViewData.students.push(oDialogData);
             this.getView().getModel().setData(oViewData);
        }


    });



});