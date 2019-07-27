const rpc = new window.IOST.RPC(new IOST.HTTPProvider("https://api.iost.io"));
const contractAddress = 'ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX';

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: 'Please Login IWallet',
            userInput: '',
            txHash: '',
            result: '',
            isLoading: false,
            balancePlay: '',
            balanceIost: '',
            userBalance: '',
            userBalancePlay: '',


        }
        this.updateInfo = this.updateInfo.bind(this);
    }
    componentDidMount() {

        setTimeout(() => {
            IWalletJS.enable().then((account) => {
                if (!account) return;
                this.setState({
                    account: account
                })
                this.updateInfo(account);
            })

        }, 500)

    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })


    }

    updateInfo = (account) => {
        rpc.blockchain.getBalance(account, "iost", 1).then((result) => {
            this.setState({
                userBalance: result.balance.toFixed(2)
            })

        })
        rpc.blockchain.getBalance(account, "iplay", 1).then((result) => {
            this.setState({
                userBalancePlay: result.balance.toFixed(2)
            })

        })

        rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iost", 1).then((balanceIost) => {
            this.setState({
                balanceIost: balanceIost.balance.toFixed(2)
            })

        })
        rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iplay", 1).then((balancePlay) => {
            if (!balancePlay) return;
            this.setState({
                balancePlay: balancePlay.balance.toFixed(2)
            })
        })
        console.log('updated info');

    }

    buyIplay = () => {

        const {
            userInput
        } = this.state
        if (userInput !== "") {
            IWalletJS.enable().then((account) => {
                if (account) {
                    const iost = IWalletJS.newIOST(IOST)
                    const tx = iost.callABI(contractAddress, "buyPlay", [account, (userInput * 0.02).toString()]);
                    tx.amount_limit = [{
                        "token": "iost",
                        "value": (userInput * 0.02).toString()
                    }]



                    iost.signAndSend(tx)
                        .on('pending', (pending) => {
                            console.log(pending, 'pending')
                            this.setState({
                                isLoading: true,
                                txHash: pending,
                                result: ''
                            })
                        })
                        .on('success', (result) => {
                            console.log(result, userInput, 'result')
                            this.setState({
                                isLoading: false,
                                result: `Success, you have received ${userInput} iPLAY tokens`
                            })


                            this.updateInfo(this.state.account);

                        })
                        .on('failed', (failed) => {
                            console.log(failed, 'failed')
                            this.setState({
                                isLoading: false,
                                result: "Something went wrong"
                            })
                        })
                } else {
                    console.log('Not logged in')
                }

            })
        } else {
            window.alert("Please input the amount you wish to buy")
        }

    }

    sellIplay = () => {

        const {
            userInput
        } = this.state
        if (userInput !== "") {
            IWalletJS.enable().then((account) => {
                if (account) {
                    const iost = IWalletJS.newIOST(IOST)
                    const tx = iost.callABI(contractAddress, "sellPlay", [account, userInput]);
                    tx.amount_limit = [{
                        "token": "iplay",
                        "value": (userInput).toString()
                    }]
                    iost.signAndSend(tx)
                        .on('pending', (pending) => {
                            console.log(pending, 'pending')
                            this.setState({
                                isLoading: true,
                                txHash: pending,
                                result: ''
                            })
                        })
                        .on('success', (result) => {
                            console.log(result, userInput, 'result')
                            this.setState({
                                isLoading: false,
                                result: `Success! You have received ${(userInput*0.007).toFixed(4)} IOST`
                            })
                            this.updateInfo(this.state.account);
                        })
                        .on('failed', (failed) => {
                            console.log(failed, 'failed')
                            this.setState({
                                isLoading: false,
                                result: "Something went wrong"

                            })
                        })
                } else {
                    console.log('Not logged in')
                }
            })
        } else {
            window.alert("Please input the amount you wish to sell")
        }


    }

    render() {
        const {
            txHash,
            result,
            isLoading,
            account,
            balancePlay,
            balanceIost,
            userBalance,
            userBalancePlay,
            userInput
        } = this.state
        return ( 
               <div>
        <div className='content'>
      <header className="title">Trade iPLAY</header>
      <div className="contractInfo">
      <h1 className="contractInfoTitle">Contract Balance  </h1>
      <h1 className="contractInfoText"> {balanceIost} IOST  </h1>
      <h1 className="contractInfoText"> {balancePlay} iPLAY </h1>
      </div>
      <input
      className="inputbox"
      name="userInput"
      autocomplete="off"
      placeholder="Enter amount of iPLAY tokens"
      onChange={this.handleChange}
      />

      <p>Buy: {(userInput*0.02).toFixed(3)} IOST | Sell: {(userInput*0.007).toFixed(3)} IOST</p>
      <div className="contractInfo">
      <h1 className="contractInfoTitle">Account: {account}  </h1>
      <h1 className="contractInfoText">{userBalance} IOST</h1>
      <h1 className="contractInfoText">{userBalancePlay} iPLAY</h1>
      </div>
      <div className="btn-group">
      <button
      className="tradebutton"
      onClick={this.buyIplay}
      >
      Buy iPLAY Tokens
      </button>

      <button
      className="tradebutton"
      onClick={this.sellIplay}
      >
      Sell iPLAY Tokens
      </button>

      </div>

     

      {isLoading && (
          
        <div className="txtext">
        <p> <img className="pics" src="https://i.imgur.com/OVPxCO7.gif" />  Processing tx...</p>
        </div>
        )}
          
      {result && (
        <p className="txtext"><img className="pics" src="https://icon2.kisspng.com/20180320/tuw/kisspng-check-mark-computer-icons-clip-art-green-check-mark-2-icon-5ab1d1bfebf0f5.0376901715216030079664.jpg" /> {result}</p>
        )}

      
        </div>
        <div className="footertext">

        <footer> <a className="footertext" href="https://www.iostabc.com/contract/ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX" target="_blank">Open Source Smart Contract</a></footer>
        </div>
        </div>

        )
    }
}

ReactDOM.render( < HelloWorld / > , document.getElementById('app'))
