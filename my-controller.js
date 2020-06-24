var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
const marked = require('marked');


mongoose.connect('mongodb+srv://avinash:avinash@cluster0-navhe.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
  useUnifiedTopology: true
});

const schema = mongoose.Schema({

    title: {
        type:String,
        required:true
    },
    description: {
        type:String
    },
    story: {
        type:String,
        required:true
    },

    createdat:{
        type:Date,
        default:Date.now()
    },

    sanitizedHtml: {
        type: String,
        required: true
      }

    });

      schema.pre('validate', function(next) {
        if (this.story) {
            this.sanitizedHtml = dompurify.sanitize(marked(this.story))
          }
        
          next()
      })




const model = mongoose.model('data',schema);

/*var itemone = model({title: 'xyz', description:'xyz'}).save(function(err){
    if(err) throw err;
    console.log("saved");
});*/

module.exports = function(app){

    app.use(methodOverride('_method'));
    app.get('/', function(req,res){
        model.find({}, function (err, data) {
            if(err) throw err;

            res.render("home",{data: data});
          });
        
    });

    app.get('/new', function(req,res){
        res.render("new");
    });

    app.get('/view/:id', function(req,res){
        model.findOne({_id: req.params.id}, function(err,data){
            if(err) throw err;
            console.log(data.title);
            res.render('view_article', {data: data});
        });
    });
    
    app.post('/contact', urlencodedParser, function(req,res){
        //res.render("home",{name : "Avi"});
        var task = model(req.body).save(function(err){
            if(err) throw err;
            console.log(req.body._id);
            res.redirect("/");
        });
        //console.log(req.body.name);
        
    });

    app.delete('/delete/:id', function(req,res){
       model.remove({_id: req.params.id},function(err, doc){
            console.log(err);
            
            res.redirect('/');
            });
    
        
    });

    app.get('/update/:id', function(req,res){
        model.findOne({_id: req.params.id}, function(err,data){
            if(err) throw err;
            console.log(data);
            res.render('update', {data: data});
        });
       
     });

     app.post('/update-done/:id', urlencodedParser, function(req,res){
        //res.render("home",{name : "Avi"});
        model.remove({_id: req.params.id},function(err, doc){
            
            });
        var task = model(req.body).save(function(err){
            if(err) throw err;
            console.log(req.body._id);
            res.redirect("/");
        });
        //console.log(req.body.name);
        
    });

     

    

};