const {render} = ReactDOM;
const colors = ["#FB6D1E","#FB1EAC","#1EFB6D","#1EACFB","#1E3EFB","#3EFB1E"];
var colorIndex = 0;

class Quote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {quote: props.quote, author: props.author};
    this.update = this.update.bind(this);
  }
  render() {
    const twitLink = "https://twitter.com/intent/tweet?hashtags=quotes&text=" + 
           "\"" + this.state.quote + "\"" + " - " + this.state.author;
    return(
      <div id="quote-box">
        <div id="quote-content">
          <p id="text">"{this.state.quote}"</p>
          <p id="author">- {this.state.author}</p>
        </div>
        <div id="quote-buttons">
          <a id="tweet-quote" href={twitLink} className="button">Tweet Quote</a>
          <button type="button" id="new-quote" onClick={this.update} target="_blank" class="button">New Quote</button>
        </div>
      </div>);
  }
  update() {
    var t = this;
    $("html").animate({"background-color":colors[colorIndex]},1200);
    $("body").animate({"background-color":colors[colorIndex]},1200);
    $("#quote-content").fadeTo(600,0,function() {
    $.getJSON("https://talaikis.com/api/quotes/random/", function(res) {
      t.setState({quote:res.quote});
      t.setState({author:res.author});
      $("#quote-content").fadeTo(600,1);
    });});
    colorIndex = (colorIndex + 1) % colors.length;
  }
}

render(<Quote quote="Hello" author="Ben"/>,document.getElementById("content"));
