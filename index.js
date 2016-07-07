var RecipeBox = React.createClass({

    getInitialState: function() {
        return {
            recipes: [{name: "PB&J", ingredients: ["peanut butter", "jelly", "bread"], id: 0}],
            currentName: "",
            currentIngredients: [],
            nextId: 1,
            currentEdit: 0
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var newList = this.state.recipes;
        var newRecipe;
        if (this.state.currentName !== "" && this.state.currentIngredients.length > 0) {
            if (!this.state.editMode) {
                newRecipe = {name: this.state.currentName, ingredients: this.state.currentIngredients, id: this.state.nextId};
                newList = newList.concat([newRecipe]);
                this.setState({
                    currentName: "",
                    currentIngredients: [],
                    recipes: newList,
                    nextId: this.state.nextId + 1
                });
            } else {
                newList[this.state.currentEdit].name = this.state.currentName;
                newList[this.state.currentEdit].ingredients = this.state.currentIngredients;
                this.setState({
                    currentName: "",
                    currentIngredients: [],
                    recipes: newList,
                    editMode: false
                });
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
    handleEdit: function(recipe) {

        this.setState({
            currentName: recipe.name,
            currentIngredients: recipe.ingredients,
            editMode: true,
            currentEdit: recipe.id
        });
    },
    handleDelete: function(recipe) {
        var newList = this.state.recipes.filter(function(item) {
            return item.id !== recipe.id;
        });

        this.setState({
            recipes: newList
        });
    },
    parseIngredients: function(str) {
        return str.split(",");
    },
    stringifyIngredients: function() {
        return this.state.currentIngredients.join(",");
    },
    render: function() {
        var me = this;
        var recipes = this.state.recipes.map(function(recipe) {
            return (
                <Recipe key={recipe.id} recipe={recipe} onEdit={me.handleEdit.bind(me, recipe)}
                        onDelete={me.handleDelete.bind(me, recipe)} />
            )
        });
        var modalBtnLabel = this.state.editMode ? "Update" : "Add";
        return (
            <div>
                <div>
                    {recipes}
                </div>
                <button className="btn btn-lg btn-primary" data-toggle="modal" data-target="#myModal">Add Recipe</button>
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
            <div>
                <h1>{this.props.recipe.name}</h1>
                <ul className="list-group">
                    {ingredients}
                </ul>
                <button onClick={this.props.onEdit} className="btn btn-info" data-toggle="modal" data-target="#myModal">Edit</button>
                <button onClick={this.props.onDelete} className="btn btn-danger">Delete</button>
            </div>
        )
    }

});

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('content')
);