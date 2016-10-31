module Data_rider

end

module RandomString
  def self.gen(n)
    #(0...n).map { (65 + rand(26)).chr }.join
    # (0...n).map { ('a'..'z').to_a[rand(26)] }.join
    # (0...n).map { ('a'..'z').to_a.sample }.join
    a = (0...n).map { ('a'..'z').to_a.seeded_sample }.join
    # p a
    # a
  end
end
include RandomString


require 'active_support/time'

=begin
# Offset inputs
p / params ={ from: Time object
    d: or days: +-Fixnum
    m: or months: +-Fixnum
    y: or years: +-Fixnum
}
strf_pattern = strftime patterns.. lookup documentation in a.strftime
strf_pattern = "%m/%d/%Y" #=> "06/15/1990"
=end

def offset(p = {}, strf_pattern = nil)
  a=(p[:from] or Time.now).advance(:days => p[:d]||p[:days], :months => p[:m]||p[:months], :years => p[:y]||p[:years])
  a.strftime(strf_pattern || "%m/%d/%Y")
end

# todo: write good helper methods.. like
# def birthday_greater_than age_int
# def birthday_lesser_than age_int

def current_year
  offset({from: $eff_date}, '%Y')
end

#
def age above_or_below , age_int
  case above_or_below.to_s.downcase
    when /above/
  offset from: $effective_date, y: -age_int, d: -1
    when /below/
  offset from: $effective_date, y: -age_int #, d: +1
  end
end

def birthday_equal_to age_int
  offset from: $effective_date, y: -age_int
end

def is_age_greater_than? age_int, date_string
  get_date =-> date_str { m, d, y = date_str.split('/').map(&:to_i); Date.new(y, m, d) }
  dob      = get_date[date_string]
  cutoff   = get_date[offset from: $effective_date, y: -(age_int)]
  dob > cutoff
end

if __FILE__ == $0
  require_relative '../../useful_support/formatting_files/cosmetics'
  $seeded = Random.new 12342
  p RandomString.gen $seeded.rand(1..12)
end
if __FILE__ == $0
  $seeded         = Random.new
  $effective_date = Time.now.strftime("%m/%d/%Y")
  $effective_date = Time.now
  p offset({:from => $effective_date, :d => -21}, "%Y/%m/%d")
  p offset({from: Date.parse("2014-06-15"), years: 10})
  p offset({from: Date.parse("2014-06-15"), years: 10}, "%Y")
  p rand(1950..offset({year: -19}, "%Y").to_i)
  p offset from: $effective_date, y: -19
  p offset({from: $effective_date}, "%Y")
  p offset(from: $effective_date, y: -$seeded.rand(18..99), d: +1)
  p offset(from: $effective_date, y: -$seeded.rand(18..99), d: -1)
end