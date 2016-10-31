module Data_rider

end

module RandomString
  def self.string_gen(n)
    #(0...n).map { (65 + rand(26)).chr }.join
    # (0...n).map { ('a'..'z').to_a[rand(26)] }.join
    # (0...n).map { ('a'..'z').to_a.sample }.join
    a = (0...n).map { ('a'..'z').to_a.seeded_sample }.join
    # p a
    # a
  end

  def self.num_gen(n_digit_int)
    rnd_num = ""
    n_digit_int.times { |i|
      rnd_num += "#{rand((i==0 ? 0 : 1)..9)}"
    }
    rnd_num
  end

  def self.alpha_num_gen(n)
    #(0...n).map { (65 + rand(26)).chr }.join
    # (0...n).map { ('a'..'z').to_a[rand(26)] }.join
    # (0...n).map { ('a'..'z').to_a.sample }.join
    a = (0...n).map { (('A'..'Z').to_a+('0'..'9').to_a).sample }.join
    # p a
    # a
  end
end
include RandomString

