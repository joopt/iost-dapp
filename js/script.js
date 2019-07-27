function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const rpc = new window.IOST.RPC(new IOST.HTTPProvider("https://api.iost.io"));





class HelloWorld extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      account: 'Please Login IWallet',
      someone: '',
      txHash: '',
      result: '',
      isLoading: false,
      balancePlay: '',
      balanceIost: '',
      userBalance: '',
      userBalancePlay: '',
      playOwed: '' });_defineProperty(this, "handleChange",

    e => {
      this.setState({
        [e.target.name]: e.target.value });



    });_defineProperty(this, "hello",

    () => {
      const contractAddress = 'ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX';
      const { someone } = this.state;
      if (someone !== "") {
        IWalletJS.enable().then(account => {
          if (account) {
            const iost = IWalletJS.newIOST(IOST);
            const tx = iost.callABI(contractAddress, "buyPlay", [account, (someone * 0.02).toString()]);
            tx.amount_limit = [{
              "token": "iost",
              "value": (someone * 0.02).toString() }];

            console.log(tx.amount_limit);


            iost.signAndSend(tx).
            on('pending', pending => {
              console.log(pending, 'pending');
              this.setState({
                isLoading: true,
                txHash: pending,
                result: '' });

            }).
            on('success', result => {
              console.log(result, someone, 'result');
              this.setState({
                isLoading: false,
                result: `Success, you have received ${someone} iPLAY tokens` });


              console.log('checkpoint 1');
              rpc.blockchain.getBalance(account, "iost", 1).then(result => {
                this.setState({
                  userBalance: result.balance.toFixed(2) });

                console.log('checkpoint 2');


              });
              rpc.blockchain.getBalance(account, "iplay", 1).then(result => {
                this.setState({
                  userBalancePlay: result.balance.toFixed(2) });


              });

              rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iost", 1).then(balanceIost => {
                this.setState({
                  balanceIost: balanceIost.balance.toFixed(2) });

                console.log('checkpoint 2');
              });
              rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iplay", 1).then(balancePlay => {
                if (!balancePlay) return;
                this.setState({
                  balancePlay: balancePlay.balance.toFixed(2) });

              });

            }).
            on('failed', failed => {
              console.log(failed, 'failed');
              this.setState({
                isLoading: false,
                result: "Something went wrong" });

            });
          } else {
            console.log('not login');
          }

        });
      } else {
        window.alert("Please input the amount you wish to buy");
      }

    });_defineProperty(this, "transfer",

    () => {
      const contractAddress = 'ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX';
      const { someone } = this.state;
      if (someone !== "") {
        IWalletJS.enable().then(account => {
          if (account) {
            const iost = IWalletJS.newIOST(IOST);
            const tx = iost.callABI(contractAddress, "sellPlay", [account, someone]);
            tx.amount_limit = [{
              "token": "iplay",
              "value": someone.toString() }];

            iost.signAndSend(tx).
            on('pending', pending => {
              console.log(pending, 'pending');
              this.setState({
                isLoading: true,
                txHash: pending,
                result: '' });

            }).
            on('success', result => {
              console.log(result, someone, 'result');
              this.setState({
                isLoading: false,
                result: `Success! You have received ${(someone * 0.007).toFixed(4)} IOST` });

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
            }).
            on('failed', failed => {
              console.log(failed, 'failed');
              this.setState({
                isLoading: false,
                result: "Something went wrong" });


            });
          } else {
            console.log('not login');
          }
        });
      } else {
        window.alert("Please input the amount you wish to sell");
      }


    });}componentDidMount() {// console.log(window.IWalletJS)
    setTimeout(() => {IWalletJS.enable().then(account => {if (!account) return;this.setState({ account });rpc.blockchain.getBalance(account, "iost", 1).then(result => {this.setState({ userBalance: result.balance.toFixed(2) });});rpc.blockchain.getBalance(account, "iplay", 1).then(result => {this.setState({ userBalancePlay: result.balance.toFixed(2) });});rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iost", 1).then(balanceIost => {this.setState({ balanceIost: balanceIost.balance.toFixed(2) });});rpc.blockchain.getBalance("ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", "iplay", 1).then(balancePlay => {if (!balancePlay) return;this.setState({ balancePlay: balancePlay.balance.toFixed(2) });});});}, 500);}
  render() {
    const { txHash, result, isLoading, account, balancePlay, balanceIost, userBalance, userBalancePlay, someone } = this.state;
    return (
      React.createElement("div", { className: "HelloWorld" },
      React.createElement("header", { className: "HelloWorld__title" }, "Trade iPLAY"),
      React.createElement("div", { className: "spacing" },
      React.createElement("h1", { className: "contractInfoTitle" }, "Contract Balance  "),
      React.createElement("h1", { className: "contractInfoText" }, " ", balanceIost, " IOST  "),
      React.createElement("h1", { className: "contractInfoText" }, " ", balancePlay, " iPLAY ")),

      React.createElement("input", {
        className: "HelloWorld__input",
        name: "someone",
        autocomplete: "off",
        placeholder: "Enter amount of iPLAY tokens",
        onChange: this.handleChange }),


      React.createElement("p", null, "Buy: ", (someone * 0.02).toFixed(3), " IOST | Sell: ", (someone * 0.007).toFixed(3), " IOST"),
      React.createElement("div", { className: "spacing" },
      React.createElement("h3", { className: "contractInfoTitle" }, "Account: ", account, "  "),
      React.createElement("h3", { className: "contractInfoText" }, userBalance, " IOST"),
      React.createElement("h3", { className: "contractInfoText" }, userBalancePlay, " iPLAY")),

      React.createElement("div", { className: "btn-group" },
      React.createElement("button", {
        className: "HelloWorld__helloButton",
        onClick: this.hello }, "Buy iPLAY Tokens"),




      React.createElement("button", {
        className: "HelloWorld__helloButton",
        onClick: this.transfer }, "Sell iPLAY Tokens")),






      React.createElement("div", { className: "col-12 text-center mt-4" },

      React.createElement("a", { href: "https://t.me/Trade_iPLAY" }, React.createElement("img", { className: "tellogo", src: "http://assets.stickpng.com/thumbs/5842a8fba6515b1e0ad75b03.png" }))),


      isLoading &&

      React.createElement("div", { className: "HelloWorld__tx" },
      React.createElement("p", null, " ", React.createElement("img", { className: "gif", src: "https://i.imgur.com/OVPxCO7.gif" }), "  Processing tx...")),




      result &&
      React.createElement("p", { className: "HelloWorld__tx" }, React.createElement("img", { className: "gif", src: "https://icon2.kisspng.com/20180320/tuw/kisspng-check-mark-computer-icons-clip-art-green-check-mark-2-icon-5ab1d1bfebf0f5.0376901715216030079664.jpg" }), " ", result),


      React.createElement("div", { className: "footertext" },

      React.createElement("footer", null, " ", React.createElement("a", { className: "footertext", href: "https://www.iostabc.com/contract/ContractGJK9J9oRe5Z2sgf8Rz3GvZQztLcfoZ8mwo2wurHJGFeX", target: "_blank" }, "Open Source Smart Contract")))));




  }}


ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById('app'));
