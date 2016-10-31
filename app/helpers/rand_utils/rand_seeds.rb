module RandSeed
  def self.germinate(seed_id_int=nil)
    # $rand_mod_num = (seed_id_int || rand(50..99)).to_i
    # big_rand =-> num_of_rands_to_append { num_of_rands_to_append.times.map { rand(0..9).to_s }.join }
    # $seed_id = (ENV['seed_id'] || big_rand[30]).to_i
    # $seeded = Random.new $seed_id
    $seed_id = seed_id_int
    srand $seed_id # makes all rands repeatable!! Thanks Kernel
  end
end

