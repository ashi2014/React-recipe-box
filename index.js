var RecipeBox = React.createClass({

    getInitialState: function() {
        return {
            recipes: this.getLocalStorage(), //[{name: "PB&J", ingredients: ["peanut butter", "jelly", "bread"], id: 0}],
            currentName: "",
            currentIngredients: [],
            currentEdit: 0,
            editMode: false
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var newList = this.state.recipes;
        var newRecipe;
        if (this.state.currentName !== "" && this.state.currentIngredients.length > 0) {
            if (!this.state.editMode) {
                newRecipe = {name: this.state.currentName, ingredients: this.state.currentIngredients};
                newList = newList.concat([newRecipe]);
                this.setState({
                    currentName: "",
                    currentIngredients: [],
                    recipes: newList
                }, this.updateLocalStorage);
            } else {
                newList[this.state.currentEdit].name = this.state.currentName;
                newList[this.state.currentEdit].ingredients = this.state.currentIngredients;
                this.setState({
                    currentName: "",
                    currentIngredients: [],
                    recipes: newList,
                    editMode: false
                }, this.updateLocalStorage);
            }
        }
    },
    handleNameChange: function(e) {
        this.setState({
            currentName: e.target.value
        });
    },
    handleIngredientsChange: function(e) {
        this.setState({
            currentIngredients: this.parseIngredients(e.target.value)
        });
    },
    clearForm: function() {
        this.setState({
            currentName: "",
            currentIngredients: []
        });
    },
    handleEdit: function(index) {

        this.setState({
            currentName: this.state.recipes[index].name,
            currentIngredients: this.state.recipes[index].ingredients,
            editMode: true,
            currentEdit: index
        });
    },
    handleDelete: function(index) {
        /*var newList = this.state.recipes.filter(function(item) {
            return item.id !== recipe.id;
        });*/

        var newList = this.state.recipes;
        newList.splice(index, 1);

        this.setState({
            recipes: newList
        }, this.updateLocalStorage);

    },
    parseIngredients: function(str) {
        return str.split(",");
    },
    stringifyIngredients: function() {
        return this.state.currentIngredients.join(",");
    },
    updateLocalStorage: function() {
        if (typeof(Storage) !== undefined) {
            localStorage._ashi2015_recipes = JSON.stringify(this.state.recipes);
            console.log("Local storage updated: ", localStorage._ashi2015_recipes);
        }
    },
    getLocalStorage: function() {
        if (typeof(Storage) !== undefined) {
            if (localStorage._ashi2015_recipes) {
                return JSON.parse(localStorage._ashi2015_recipes);
            }
        }
        return [];
    },
    render: function() {
        var me = this;
        var recipes = this.state.recipes.map(function(recipe, i) {
            return (
                <Recipe key={i} index={i} recipe={recipe} onEdit={me.handleEdit.bind(me, i)}
                        onDelete={me.handleDelete.bind(me, i)} />
            )
        });
        var modalBtnLabel = this.state.editMode ? "Update" : "Add";
        return (
            <div>
                <h1 className="text-center">My Recipes</h1>
                <div className="panel-group col-sm-6 col-sm-offset-3" id="accordian">
                    {recipes}
                </div>
                <button className="btn btn-lg btn-primary col-sm-2 col-sm-offset-3" data-toggle="modal" data-target="#myModal">Add Recipe</button>
                <div className="modal" id="myModal">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" onClick={this.clearForm} className="close" data-dismiss="modal">&times;</button>
                          <h4 className="modal-title">Add New Recipe</h4>
                        </div>
                        <div className="modal-body">
                          <form>
                            <div className="form-group">
                                <label>Name: </label>
                                <input className="form-control" onChange={this.handleNameChange} value={this.state.currentName}></input>
                            </div>
                            <div className="form-group">
                                <label>Ingredients: </label>
                                <input className="form-control" onChange={this.handleIngredientsChange} value={this.stringifyIngredients()} placeholder="List ingredients separated by a comma (e.g. apples, pears, oranges)"></input>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.handleSubmit} className="btn btn-primary" data-dismiss="modal">{modalBtnLabel}</button>
                            <button className="btn btn-default" onClick={this.clearForm} data-dismiss="modal">Close</button>
                        </div>
                      </div>

                    </div>
                </div>
            </div>
        )
    }
});

var Recipe = React.createClass({

    render: function() {
        var ingredients = this.props.recipe.ingredients.map(function(ingredient, i) {
            return (
                <li key={i} className="list-group-item">{ingredient}</li>
            )
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h1 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href={"#collapse" + this.props.index}>
                            {this.props.recipe.name}
                        </a>
                    </h1>
                </div>
                <div id={"collapse" + this.props.index} className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul className="list-group">
                            {ingredients}
                        </ul>
                        <button onClick={this.props.onEdit} className="btn btn-info" data-toggle="modal" data-target="#myModal">Edit</button>
                        <button onClick={this.props.onDelete} className="btn btn-danger">Delete</button>
                    </div>
               </div>
            </div>
        )
    }

});

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('content')
);