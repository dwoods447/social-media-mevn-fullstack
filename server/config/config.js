
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