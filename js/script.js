function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const rpc = new window.IOST.RPC(new IOST.HTTPProvider("https://api.iost.io"));
const contractAddress = 'ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX';

class HelloWorld extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "handleChange",

    e => {
      this.setState({
        [e.target.name]: e.target.value });



    });_defineProperty(this, "updateInfo",

    account => {
      rpc.blockchain.getBalance(account, "iost", 1).then(result => {
        this.setState({
          userBalance: result.balance.toFixed(2) });


      });
      rpc.blockchain.getBalance(account, "iplay", 1).then(result => {
        this.setState({
          userBalancePlay: result.balance.toFixed(2) });


      });

      rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iost", 1).then(balanceIost => {
        this.setState({
          balanceIost: balanceIost.balance.toFixed(2) });


      });
      rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iplay", 1).then(balancePlay => {
        if (!balancePlay) return;
        this.setState({
          balancePlay: balancePlay.balance.toFixed(2) });

      });
      console.log('updated info');

    });_defineProperty(this, "buyIplay",

    () => {

      const {
        userInput } =
      this.state;
      if (userInput !== "") {
        IWalletJS.enable().then(account => {
          if (account) {
            const iost = IWalletJS.newIOST(IOST);
            const tx = iost.callABI(contractAddress, "buyPlay", [account, (userInput * 0.02).toString()]);
            tx.amount_limit = [{
              "token": "iost",
              "value": (userInput * 0.02).toString() }];




            iost.signAndSend(tx).
            on('pending', pending => {
              console.log(pending, 'pending');
              this.setState({
                isLoading: true,
                txHash: pending,
                result: '' });

            }).
            on('success', result => {
              console.log(result, userInput, 'result');
              this.setState({
                isLoading: false,
                result: `Success, you have received ${userInput} iPLAY tokens` });



              this.updateInfo(this.state.account);

            }).
            on('failed', failed => {
              console.log(failed, 'failed');
              this.setState({
                isLoading: false,
                result: "Something went wrong" });

            });
          } else {
            console.log('Not logged in');
          }

        });
      } else {
        window.alert("Please input the amount you wish to buy");
      }

    });_defineProperty(this, "sellIplay",

    () => {

      const {
        userInput } =
      this.state;
      if (userInput !== "") {
        IWalletJS.enable().then(account => {
          if (account) {
            const iost = IWalletJS.newIOST(IOST);
            const tx = iost.callABI(contractAddress, "sellPlay", [account, userInput]);
            tx.amount_limit = [{
              "token": "iplay",
              "value": userInput.toString() }];

            iost.signAndSend(tx).
            on('pending', pending => {
              console.log(pending, 'pending');
              this.setState({
                isLoading: true,
                txHash: pending,
                result: '' });

            }).
            on('success', result => {
              console.log(result, userInput, 'result');
              this.setState({
                isLoading: false,
                result: `Success! You have received ${(userInput * 0.007).toFixed(4)} IOST` });

              this.updateInfo(this.state.account);
            }).
            on('failed', failed => {
              console.log(failed, 'failed');
              this.setState({
                isLoading: false,
                result: "Something went wrong" });


            });
          } else {
            console.log('Not logged in');
          }
        });
      } else {
        window.alert("Please input the amount you wish to sell");
      }


    });this.state = { account: 'Please Login IWallet', userInput: '', txHash: '', result: '', isLoading: false, balancePlay: '', balanceIost: '', userBalance: '', userBalancePlay: '' };this.updateInfo = this.updateInfo.bind(this);}componentDidMount() {setTimeout(() => {IWalletJS.enable().then(account => {if (!account) return;this.setState({ account: account });this.updateInfo(account);});}, 500);}

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
      userInput } =
    this.state;
    return (
      React.createElement("div", null,
      React.createElement("div", { className: "content" },
      React.createElement("header", { className: "title" }, "Trade iPLAY"),
      React.createElement("div", { className: "contractInfo" },
      React.createElement("h1", { className: "contractInfoTitle" }, "Contract Balance  "),
      React.createElement("h1", { className: "contractInfoText" }, " ", balanceIost, " IOST  "),
      React.createElement("h1", { className: "contractInfoText" }, " ", balancePlay, " iPLAY ")),

      React.createElement("input", {
        className: "inputbox",
        name: "userInput",
        autocomplete: "off",
        placeholder: "Enter amount of iPLAY tokens",
        onChange: this.handleChange }),


      React.createElement("p", null, "Buy: ", (userInput * 0.02).toFixed(3), " IOST | Sell: ", (userInput * 0.007).toFixed(3), " IOST"),
      React.createElement("div", { className: "contractInfo" },
      React.createElement("h1", { className: "contractInfoTitle" }, "Account: ", account, "  "),
      React.createElement("h1", { className: "contractInfoText" }, userBalance, " IOST"),
      React.createElement("h1", { className: "contractInfoText" }, userBalancePlay, " iPLAY")),

      React.createElement("div", { className: "btn-group" },
      React.createElement("button", {
        className: "tradebutton",
        onClick: this.buyIplay }, "Buy iPLAY Tokens"),




      React.createElement("button", {
        className: "tradebutton",
        onClick: this.sellIplay }, "Sell iPLAY Tokens")),


      isLoading &&

      React.createElement("div", { className: "txtext" },
      React.createElement("p", null, " ", React.createElement("img", { className: "pics", src: "https://i.imgur.com/OVPxCO7.gif" }), "  Processing tx...")),



      result &&
      React.createElement("p", { className: "txtext" }, React.createElement("img", { className: "pics", src: "https://icon2.kisspng.com/20180320/tuw/kisspng-check-mark-computer-icons-clip-art-green-check-mark-2-icon-5ab1d1bfebf0f5.0376901715216030079664.jpg" }), " ", result)),




      React.createElement("div", { className: "footertext" },

      React.createElement("footer", null, " ", React.createElement("a", { className: "footertext", href: "https://www.iostabc.com/contract/ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", target: "_blank" }, "Open Source Smart Contract")))));




  }}


ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById('app'));
