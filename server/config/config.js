
//const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const secret = '345gf6HGE45Y6FDG45G7868JKTJ567UWREFEDF4E32QFDEDSCSDCEW3332E4RDCVfdfr4wt43';
module.exports = {
    port: process.env.PORT || 3535,
    host: process.env.HOST || 'localhost',
    node_mailer_key: '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',
    authentication :{
        jwtSecret: secret
    },
    
    db: {
        connectString: 'mongodb+srv://dwood447:B0nky2345@cluster0-t5y96.mongodb.net/social-media-app'
    }

}