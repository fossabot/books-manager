<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookshelfTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookshelves', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
            $table->string('name');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->integer('bookshelf_id')->unsigned()
                  ->nullable()->after('user_id');
            $table->foreign('bookshelf_id')
                  ->references('id')->on('bookshelves')
                  ->onDelete('set null');
        });

        foreach (\DB::table('users')->get() as $user) {
            \DB::table('bookshelves')->insert([
                'user_id' => $user->id,
                'name' => 'default',
            ]);

            $bookshelf_id = \DB::table('bookshelves')
                ->where([ 'user_id' => $user->id, 'name' => 'default' ])
                ->get()[0]->id;

            \DB::table('books')
                ->where('user_id', $user->id)
                ->update([ 'bookshelf_id' => $bookshelf_id ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('bookshelf_id');
        });
        Schema::dropIfExists('bookshelves');
    }
}
