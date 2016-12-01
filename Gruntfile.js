module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: ['distlib/']
        },
        cssmin: { 
            options: {  
                keepSpecialComments: 0  
            }, 
            dist:{
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: './**/*.css',
                    dest: 'distlib/'
                }]
            }
        },
        copy: {
            img: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['./**/*.png', './**/*.jpg'],
                    dest: 'distlib/',
                    flatten: false
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['./**/index.html'],
                    dest: 'distlib/',
                    flatten: false
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['clean', 'cssmin', 'copy']);  
};