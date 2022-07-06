
//const Web3 = require('web3');
//const TruffleContract = require('truffle-contract');
////var web3;
//const ProvenanceArtifact = require('./build/contracts/Provenance.json');
//const TrackingArtifact = require('./build/contracts/Tracking.json');
//const ReputationArtifact = require('./build/contracts/Reputation.json');
//// transformer ce fichier en une classe afin de pouvoir l'exporter facilement
////const { ethers } = require("ethers");

utility = {

    web3Provider: null,
    contracts : {},


    connect: async function() {

      // Modern dapp browsers...
      if (window.ethereum) {
        utility.web3Provider = window.ethereum;
        try {
          // Request account access
          await ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await ethereum.request({ method: "eth_accounts" });
          console.log(accounts);
          document.getElementById("connectButton").innerHTML = accounts[0];
        } catch (error) {
          console.log(error);
        }
        
      } 
      // Legacy dapp browser...
      else if(window.web3){
        utility.web3Provider = window.web3.currentProvider;
      }
      else {
        document.getElementById("connectButton").innerHTML =
          "Please install MetaMask";
      }
      web3 = new Web3(utility.web3Provider);
      
      $.getJSON('Provenance.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var ProvenanceArtifact = data;
        utility.contracts.Provenance = TruffleContract(ProvenanceArtifact);

        // Set the provider for our contract
        utility.contracts.Provenance.setProvider(utility.web3Provider);
      });
      $.getJSON('Tracking.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var TrackingArtifact = data;
        utility.contracts.Tracking = TruffleContract(TrackingArtifact);

        // Set the provider for our contract
        utility.contracts.Tracking.setProvider(utility.web3Provider);
      });
      $.getJSON('Reputation.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var ReputationArtifact = data;
        utility.contracts.Reputation = TruffleContract(ReputationArtifact);

        // Set the provider for our contract
        utility.contracts.Reputation.setProvider(utility.web3Provider);
      });
    },
    
    // CONTRACT PROVENANCE

    addProducer: async function(name, phoneNo, cityState, country) {
      console.log(utility.contracts.Provenance)

        var ProvenanceInstance;
        web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
      
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.addProducer(name, phoneNo, cityState, country ,{from: account});
            }).then(function(result){
              console.log(result);
              console.log("Producer successfull added to the blockchain");
            }).catch(function(err){
              console.log(err.message);
            });
        });
    },

    removeProducer: async function(address, callback){
        var ProvenanceInstance;
        this.web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
      
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.removeProducer(address, {from: account});
            }).then(function(result){
              console.log(result)
              callback(result);
              console.log("Producer successfull removed to the blockchain");
            }).catch(function(err){
              console.log(err.message);
              callback("ERROR 404")
            });
        });
    },

    findProducer: async function(address){
        var ProvenanceInstance;
        web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }
            
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.findProducer(address);
            }).then(function(result){

              var tbody = $('#tbodyProducer');
              var trTemplate = $('#trTemplate');
              trTemplate.find('#name').text("dalois");
              trTemplate.find('#phone').text("65532")
              trTemplate.find('#cityState').text("dla")
              trTemplate.find('#date').text(new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}))
              if (1<2){
                trTemplate.find('#status').text('confirmed')
                trTemplate.find('#status').attr('class', 'status--process');
              }else{
                trTemplate.find('#status').text('not confirmed')
                trTemplate.find('#status').attr('class', 'status--denied');
              }              
              trTemplate.find('#country').text("cmr")
              tbody.append(trTemplate.html());
             // console.log('producer');
             // result[1] = result[1].toNumber()
             // console.log(result);
             // var tbody = $('#tbodyProducer');
             // var trTemplate = $('#trTemplate');
             // trTemplate.find('.block-name').text(result["0"]);
             // trTemplate.find('.block-email').text(result["1"])
             // trTemplate.find('.desc').text(result["2"])
             // trTemplate.find('.date').text(new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}))
             // if (result[4]){
             //   trTemplate.find('.status--process').text('confirmed')
             // }else{
             //   trTemplate.find('.status--process').text('not confirmed')
             //   trTemplate.find('.status--process').attr('class', 'status--denied');
             // }              
             // trTemplate.find('.country').text(result[3])
             // tbody.append(trTemplate.html());
            }).catch(function(err){
              console.log(err.message);
            });
        });
    },

    allProducers: async function(){
      var ProvenanceInstance;
      web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }
          
          var account = accounts[0];
          utility.contracts.Provenance.deployed().then(function(instance){
            ProvenanceInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ProvenanceInstance.allProducers.call();
          }).then(function(result){
            console.log("list of all producer");
            console.log(result);

            $('#producer').attr('style', 'color:blue');
            $('#latestAdd').attr('style', 'display:none');
            $('#producerDiv').attr('style', 'display:block');
            $('#productDiv').attr('style', 'display:none');
            $('#supplierDiv').attr('style', 'display:none');
            $('#shipmentDiv').attr('style', 'display:none');

            $('#last').attr('style', 'color:DarkSlateGrey');
            $('#product').attr('style', 'color:DarkSlateGrey');
            $('#supplier').attr('style', 'color:DarkSlateGrey');
            $('#shipment').attr('style', 'color:DarkSlateGrey');

            
            for(i=0; i<result.length; i++){
              utility.findProducer(result[i])
            }
          }).catch(function(err){
            console.log(err.message);
          });
      });
    },

    certifyProducer: async function(address, callback){
        var ProvenanceInstance;
        this.web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }

            var account = accounts[0];
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.certifyProducer(address, {from: account});
            }).then(function(result){
              console.log("producer certified");
              console.log(result);
              callback(result);
            }).catch(function(err){
              console.log(err.message);
              callback("ERROR 404")
            });
        });  
    },

    addProduct : async function(seriaNo, locationData, callback){
        var ProvenanceInstance;
        this.web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }

            var account = accounts[0];
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.addProduct(seriaNo, locationData, {from: account});
            }).then(function(result){
              console.log("product added");
              console.log(result);
              callback(result);
            }).catch(function(err){
              console.log(err.message);
              callback("ERROR 404")
            });
        });    
    },

    removeProduct : function(seriaNo, callback){
        var ProvenanceInstance;
        this.web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }

            var account = accounts[0];
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.removeProduct(seriaNo, {from: account});
            }).then(function(result){
              console.log("product removed");
              console.log(result);
              callback(result);
            }).catch(function(err){
              console.log(err.message);
              callback("ERROR 404")
            });
        });    
    }, 

    findProduct: function(seriaNo, callback){
        var ProvenanceInstance;
        this.web3.eth.getAccounts(function(error, accounts){
            if (error) {
              console.log(error);
            }

            var account = accounts[0];
            utility.contracts.Provenance.deployed().then(function(instance){
              ProvenanceInstance = instance;
      
              // Execute adopt as a transaction by sending account
              return ProvenanceInstance.findProduct(seriaNo);
            }).then(function(result){
              console.log("product");
              result[1][0]=result[1][0].toNumber();
              result[1][1]=result[1][1].toNumber();
              result[2]=result[2].toNumber()
              console.log(result);
              callback(result);
            }).catch(function(err){
              console.log(err.message);
              callback("ERROR 404")
            });
        });   
    },

    allProducts: async function(callback){
      var ProvenanceInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }
          
          utility.contracts.Provenance.deployed().then(function(instance){
            ProvenanceInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ProvenanceInstance.allProducts();
          }).then(function(result){
            console.log("all products");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    // CONTRACT TRACKING

    sendToken: function(address, amount, callback){
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.sendToken(address, amount, {from: account});
          }).then(function(result){
            console.log("Token send");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      }); 
    },

    getBalance: function(address, callback){
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.getBalance(address);
          }).then(function(result){
            console.log("balance");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      }); 
    },


    recoverToken: function(address, amount, callback){
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.recoverToken(address, amount, {from: account});
          }).then(function(result){
            console.log("token recovered");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    setContractParameters: function(location1, location2, leadTime, payment, callback){
      var location = [location1, location2];
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.setContractParameters(location, leadTime, payment, {from: account});
          }).then(function(result){
            console.log("parameters setted");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    sendShipment: function(trackinNo, item, quantity, location1, location2){
      var TrakingInstance;
      var location = [location1, location2];
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.sendShipment(trackinNo, item, quantity, location, {from: account});
          }).then(function(result){
            console.log("shipment send");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    }, 

    recieveShipment: function(trackinNo, item, quantity, location1, location2){
      var TrakingInstance;
      var location = [location1, location2];
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.receiveShipment(trackinNo, item, quantity, location, {from: account});
          }).then(function(result){
            console.log("recive shipment");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    deleteShipment: function(trackinNo){
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.deleteShipment(trackinNo, {from: account});
          }).then(function(result){
            console.log("all products");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    checkShipment: function(trackingNo, callback){
      var ProvenanceInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Provenance.deployed().then(function(instance){
            ProvenanceInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ProvenanceInstance.checkShipment(trackingNo);
          }).then(function(result){
            console.log("shipment");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });   
    },

    checkSuccess: function(address, callback){
      var ProvenanceInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Provenance.deployed().then(function(instance){
            ProvenanceInstance = instance;
          
            // Execute adopt as a transaction by sending account
            return ProvenanceInstance.checkSuccess(address);
          }).then(function(result){
            console.log("shipment");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });   
    },

    allShipment: async function(callback){
      var ProvenanceInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          utility.contracts.Provenance.deployed().then(function(instance){
            ProvenanceInstance = instance;
          
            // Execute adopt as a transaction by sending account
            return ProvenanceInstance.allShipment();
          }).then(function(result){
            console.log("all shipment");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    calculateReputation: function(address, callback){
      var TrakingInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Tracking.deployed().then(function(instance){
            TrakingInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return TrakingInstance.calculateReputation(address, {from: account});
          }).then(function(result){
            console.log("calcul reputation");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },
   

    // CONTRACT REPUTATION
    addSupplier: function(name, phoneNo, cityState, country, goodsType, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.addSupplier(name, phoneNo, cityState, country, goodsType, {from: account});
          }).then(function(result){
            console.log("supplier added");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    removeSupplier: function(address, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.removeSupplier(address, {from: account});
          }).then(function(result){
            console.log("supplier removed");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    }, 

    findSupplier: function(address, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.findSupplier(address);
          }).then(function(result){
            console.log("supplier");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    }, 
    
    allSuppliers: function(callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.allSuppliers();
          }).then(function(result){
            console.log("all suppliers");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    filterByGoodsType: function(goodsType, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.filterByGoodsType(goodsType);
          }).then(function(result){
            console.log("filter by good type");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    }, 

    filterByReputation: function(reputation, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.filterByReputation(reputation);
          }).then(function(result){
            console.log("filter by reputation");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    checkReputation: function(address, callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.checkReputation(address);
          }).then(function(result){
            console.log("reputation");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    },

    updateReputation: function(callback){
      var ReputationInstance;
      this.web3.eth.getAccounts(function(error, accounts){
          if (error) {
            console.log(error);
          }

          var account = accounts[0];
          utility.contracts.Reputation.deployed().then(function(instance){
            ReputationInstance = instance;
    
            // Execute adopt as a transaction by sending account
            return ReputationInstance.updateReputation({from : account});
          }).then(function(result){
            console.log("Reputation updated");
            console.log(result);
            callback(result);
          }).catch(function(err){
            console.log(err.message);
            callback("ERROR 404")
          });
      });
    }

}
















