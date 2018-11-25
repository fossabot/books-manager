<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

use App\Bookshelf;

class Book extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [ 'id', 'user_id', 'bookshelf_id', 'title', 'volume', 'authors', 'isbn', 'jpno', 'publisher', 'price', 'ndl_url' ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [ 'user_id' ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [ 'isbn10', 'images' ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('user_id', function (Builder $builder) {
            $builder->where('user_id', \Auth::id());
        });
    }

    public function scopeShelves(Builder $query, ?int $sid)
    {
        if ($sid === null) {
            $sid = Bookshelf::default()->id;
        }

        return $query->where('bookshelf_id', $sid);
    }

    public function getIsbn10Attribute()
    {
        if ($this->isbn !== null) {
            return \NDL::toISBN10($this->isbn);
        }
    }

    public function getImagesAttribute()
    {
        return \AmazonImages::all($this->isbn10, \Config::get('app.url'));
    }
}
