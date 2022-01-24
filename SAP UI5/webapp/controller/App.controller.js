sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",

], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("webapp.App", {
        //********************************************** */
        // FUNÇÃO QUE SE INICIALIZA QUANDO A APLICAÇÃO RODA
        //*********************************************** */
        onInit: function () {
            //Modelo definido
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
        //**************************** */
        // ATUALIZA LISTA CONTATOS - GET
        //**************************** */
        handleRefreshContato: function () {

            var sUrl = "http://localhost:3333/obterContatos";
            var that = this;

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: sUrl,
                datatype: "json",
                success: function (data) {

                    //Obtem os dados registrados no modelo proposto em onInit()
                    var oViewData = that.getView().getModel().getData();
                    //Remove dados anteriores da lista
                    for (let i = oViewData.students.length; i > 0; i--) {
                        oViewData.students.pop();
                    }
                    //Adiciona novamente os dados na lista
                    data.forEach(element => {
                        console.log(element)
                        oViewData.students.push(element)
                    });

                    that.getView().getModel().setData(oViewData);


                },
                error: function (textStatus) {
                    //Caso ocorra um erro ao solicitar dados a função error será chamada                    
                    console.log(textStatus);
                }
            });

        },

        onAfterRendering: function () {
            var oModel = new sap.ui.model.json.JSONModel(this.data);
            this.getView().setModel(oModel);
        },
        //**************************** */
        // BUTTON ADICIONA CONTATO  
        //**************************** */
        handleAddContato: function (oEvent) {
            if (!this.newContactDialog) {
                //Acessa o xlm da Caixa de Diálogo (register.fragment.xml) contruída.
                this.newContactDialog = sap.ui.xmlfragment("webapp.register", this);
                //Obtém o modelo montado na Caixa de Diálogo (register.fragment.xml)
                var oModel = new sap.ui.model.json.JSONModel();
                this.newContactDialog.setModel(oModel);
            }
            var data = JSON.parse(JSON.stringify(this.student));
            this.newContactDialog.getModel().setData(data)
            this.newContactDialog.open();

        },
        //********************************** */
        // BUTTON DELETA CONTATO LISTA - DELETE
        //*********************************** */
        handleDeleteStudent: function (oEvent) {
            //Obtém o objeto específico do botão clicado na tela
            var oCurrentStudent = oEvent.getSource().getBindingContext().getObject();
            //Obtém os dados do objeto Data do método onInit()
            var oViewData = this.getView().getModel().getData();
            for (var i = 0; i < oViewData.students.length; i++) {
                var temp = oViewData.students[i];
                if (temp.id === oCurrentStudent.id) {
                    oViewData.students.splice(i, 1);
                    break;
                }
            }
            //Insere os dados Data novamente na tela.
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
            alert("Dado Deletado com Sucesso!");



        },

     
        //***************************************** */
        // BUTTON CANCELAR - CAIXA DIALOGO (ADD CONTATO)
        //****************************************** */
        handleCancelBtnPress: function () {
            this.newContactDialog.close();
        },
        //********************************************************* */
        // BUTTON SAVE CONTATO - CAIXA DE DIALOGO (ADD CONTATO) - POST
        //********************************************************** */
        handleSaveBtnPress: function (oEvent) {
            //Obtendo o modelo da Caixa de Diálogo
            var oModel = oEvent.getSource().getModel();
            //Obtendo os dados do modelo (Caixa de diálogo)(newContactDialog)
            var oDialogData = oModel.getData();
            //Obtendo o modelo(data) definido no metodo onAfterRendering.
            var oViewData = this.getView().getModel().getData();
            //Inserindo os dados obtidos da Caixa de Dialogo (newContactDialog) no modelo definido (data) 
            oViewData.students.push(oDialogData);

            //this.getView().getModel().setData(oViewData); Faz os dados aparecerem na lista

            var sUrl = "http://localhost:3333/cadastrarContato";
            $.ajax({
                url: sUrl,
                dataType: "json",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(oDialogData),
                success: function (data, textStatus, xhr) {
                    alert("Contato criado com Sucesso!" + "\n\n" + "Atualize a lista de contatos!");

                }
            });
            this.newContactDialog.close();
        },
        //***********************************/
        // CAMPO DE PESQUISA LISTA CONTATO
        //**********************************/
        handleStudentSearch: function (oEvent) {
            var oStudentList = this.getView().byId("idStudentList");
            var oItemsBinding = oStudentList.getBinding("items");
            var sValue = oEvent.oSource.getValue();
            var oNameFilter = new sap.ui.model.Filter("namePerson", sap.ui.model.FilterOperator.Contains, sValue);
            oItemsBinding.filter(oNameFilter)
        }
    });



});