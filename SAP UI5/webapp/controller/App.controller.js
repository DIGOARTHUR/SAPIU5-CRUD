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
            var data =JSON.parse(JSON.stringify(this.student));
            this.newContactDialog.getModel().setData(data) 
            this.newContactDialog.open();
           


        },

        handleDeleteStudent: function(oEvent){
            var oCurrentStudent= oEvent.getSource().getBindingContext().getObject(); 
            var oViewData = this.getView().getModel().getData();
            for(var i=0; i<oViewData.students.length;i++){
                var temp= oViewData.students[i];
                if(temp.id === oCurrentStudent.id){
                    oViewData.students.splice(i,1);
                    break;
                }
            }
            this.getView().getModel().setData(oViewData);
        },

        handleEditStudent:function(oEvent){
           var oCurrentStudent= oEvent.getSource().getBindingContext().getObject(); //Obtém o objetivo específico da linha
            this.newContactDialog.getModel().setData(oCurrentStudent);
            this.newContactDialog.open();


        },
        handleCancelBtnPress: function(){
            this.newContactDialog.close();
        },
        handleSaveBtnPress:function(oEvent){
             var oModel = oEvent.getSource().getModel();
             var oDialogData = oModel.getData();

             var oViewData = this.getView().getModel().getData();
             oViewData.students.push(oDialogData);
             this.getView().getModel().setData(oViewData);
             this.newContactDialog.close();
        },
        handleStudentSearch:function(oEvent){
            var oStudentList = this.getView().byId("idStudentList");
            var oItemsBinding = oStudentList.getBinding("items");
            var sValue = oEvent.oSource.getValue();
            var oNameFilter= new sap.ui.model.Filter("namePerson", sap.ui.model.FilterOperator.Contains,sValue);
            oItemsBinding.filter(oNameFilter)
        }
    });



});