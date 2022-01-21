sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",

], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("webapp.App", {

        onInit: function () {

            this.student = {
                namePerson: "",
                address: "",
                phone: "",

            };


            this.data = {
                students: [],
                student: this.student
            };
            
        },

        handleRefreshContato: function () {
           
            var sUrl = "http://localhost:3333/obterContatos";
            var that = this;

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: sUrl,
                datatype: "json",
                success: function (data) {

                   
                    var oViewData = that.getView().getModel().getData();
                    //REMOVER DADOS ANTERIORES
                    for (let i = oViewData.students.length; i > 0; i--) {
                        oViewData.students.pop();
                      }
                    //ADICIONAR DADOS DA API
                    for (var i = 0; i < data.length; i++) {
                        oViewData.students.push(data[i])
                    }

                    that.getView().getModel().setData(oViewData);


                },
                error: function (data, textStatus, jqXHR) {
                    //Caso ocorra um erro ao solicitar dados a função error será chamada                    
                    console.log(textStatus);
                }
            });

        },

        onAfterRendering: function () {
            var oModel = new sap.ui.model.json.JSONModel(this.data);
            this.getView().setModel(oModel);
        },

        handleAddContato: function (oEvent) {
            if (!this.newContactDialog) {
                this.newContactDialog = sap.ui.xmlfragment("webapp.register", this);
                var oModel = new sap.ui.model.json.JSONModel();
                this.newContactDialog.setModel(oModel);
            }
            var data = JSON.parse(JSON.stringify(this.student));
            this.newContactDialog.getModel().setData(data)
            this.newContactDialog.open();

        },

        handleDeleteStudent: function (oEvent) {
            var oCurrentStudent = oEvent.getSource().getBindingContext().getObject();
            console.log(oCurrentStudent.id)
            var oViewData = this.getView().getModel().getData();
            for (var i = 0; i < oViewData.students.length; i++) {
                var temp = oViewData.students[i];
                if (temp.id === oCurrentStudent.id) {
                    oViewData.students.splice(i, 1);
                    break;
                }
            }
            this.getView().getModel().setData(oViewData);


           
            //GET API 
            var sUrl = `http://localhost:3333/todos/${oCurrentStudent.id}`;
       
            $.ajax({
               url: sUrl,
               type: "DELETE",            
               contentType: "application/json",
               dataType: "text",
               sucess: function (data, textStatus, jqXHR) {
                  
               },
               error: function (data, textStatus, jqXHR) {
                  //Caso ocorra um erro ao solicitar dados a função error será chamada                    
                  console.log(textStatus);
               }
            });
                alert("Delete: Success");



        },

        handleEditStudent: function (oEvent) {
            var oCurrentStudent = oEvent.getSource().getBindingContext().getObject(); //Obtém o objetivo específico da linha
            this.newContactDialog.getModel().setData(oCurrentStudent);
            this.newContactDialog.open();


        },
        handleCancelBtnPress: function () {
            this.newContactDialog.close();
        },
        handleSaveBtnPress: function (oEvent) {
            var oModel = oEvent.getSource().getModel();
            var oDialogData = oModel.getData();
            var oViewData = this.getView().getModel().getData();
            oViewData.students.push(oDialogData);
            //this.getView().getModel().setData(oViewData); Faz os dados aparecer na lista

            var sUrl = "http://localhost:3333/cadastrarContato";
            $.ajax({
               url: sUrl,
               dataType: "json",
               type: "POST",
               contentType: 'application/json',
               data: JSON.stringify(oDialogData),
               success: function (data, textStatus, xhr) {
                alert("Contato criado com Sucesso!"+"\n\n" +"Atualize a lista de contatos!");
                 
               }
            });
            this.newContactDialog.close();
        },
        //*******************************************************/
        //
        //******************************************************/
        handleStudentSearch: function (oEvent) {
            var oStudentList = this.getView().byId("idStudentList");
            var oItemsBinding = oStudentList.getBinding("items");
            var sValue = oEvent.oSource.getValue();
            var oNameFilter = new sap.ui.model.Filter("namePerson", sap.ui.model.FilterOperator.Contains, sValue);
            oItemsBinding.filter(oNameFilter)
        }
    });



});